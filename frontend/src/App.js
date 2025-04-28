import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  MiniMap,
  Controls,
  useReactFlow
} from 'react-flow-renderer';
import './App.css';

import deviceIcon from './icons/device.svg';
import switchIcon from './icons/switch.svg';
import starIcon   from './icons/star.svg';

let id = 3;
const getId = () => `${id++}`;

function FlowCanvas({ elements, setElements }) {
  const { project, getViewport } = useReactFlow();
  const wrapper = useRef(null);

  // 1) Fetch topology once
  useEffect(() => {
    fetch('/api/topology')
      .then(res => res.json())
      .then(({ nodes, edges }) => {
        console.log('Topology payload:', { nodes, edges });
        setElements([...nodes, ...edges]);
      })
      .catch(err => console.error('Failed to load topology', err));
  }, [setElements]);

  // 2) Add-at-center helper
  const addAtCenter = useCallback((type) => {
    const vp = getViewport();
    const newNode = {
      id: getId(),
      type: 'default',
      position: {
        x: vp.x + vp.width  / 2 - 75,
        y: vp.y + vp.height / 2 - 25
      },
      data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
      style: { width: 150 }
    };
    setElements(es => [...es, newNode]);
  }, [getViewport, setElements]);

  // 3) Listen for global "addNodeAtCenter"
  useEffect(() => {
    const h = e => addAtCenter(e.detail);
    window.addEventListener('addNodeAtCenter', h);
    return () => window.removeEventListener('addNodeAtCenter', h);
  }, [addAtCenter]);

  // 4) Drag-over / drop handlers
  const onDragOver = useCallback(evt => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(evt => {
    evt.preventDefault();
    const type = evt.dataTransfer.getData('application/reactflow');
    const bounds = wrapper.current.getBoundingClientRect();
    const coords = project({
      x: evt.clientX - bounds.left,
      y: evt.clientY - bounds.top
    });
    const node = {
      id: getId(),
      type: 'default',
      position: coords,
      data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
      style: { width: 150 }
    };
    setElements(es => [...es, node]);
  }, [project, setElements]);

  return (
    <div ref={wrapper} className="react-flow-wrapper">
      <ReactFlow
        elements={elements}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
      >
        <Background gap={16} />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}

function App() {
  const [elements, setElements] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // dispatch center-add
  const addNode = (type) => {
    window.dispatchEvent(new CustomEvent('addNodeAtCenter', { detail: type }));
    setMenuOpen(false);
  };

  return (
    <div className="app">
      <ReactFlowProvider>
        <FlowCanvas elements={elements} setElements={setElements} />
      </ReactFlowProvider>

      {/* Floating "+" button */}
      <button
        className={`fab ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(m => !m)}
      >
        +
      </button>

      {/* Hidden toolbar */}
      {menuOpen && (
        <div className="toolbar">
          {[
            { type: 'device', icon: deviceIcon, label: 'Device' },
            { type: 'switch', icon: switchIcon, label: 'Switch' },
            { type: 'icon'  , icon: starIcon  , label: 'Icon'   },
          ].map(item => (
            <div
              key={item.type}
              className="tool"
              draggable
              onDragStart={e =>
                e.dataTransfer.setData('application/reactflow', item.type)
              }
              onClick={() => addNode(item.type)}
            >
              <img src={item.icon} alt={item.label} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
