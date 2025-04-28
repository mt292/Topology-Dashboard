import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  MiniMap,
  Controls,
  useReactFlow,
} from 'react-flow-renderer';
import './App.css';

import deviceIcon from './icons/device.svg';
import switchIcon from './icons/switch.svg';
import starIcon   from './icons/star.svg';

let id = 3;
const getId = () => `${id++}`;

function FlowCanvas({ elements, setElements }) {
  const { project, getViewport } = useReactFlow();

  // helper to add at center
  const addAtCenter = (type) => {
    const vp = getViewport();
    const pos = {
      x: vp.x + vp.width  / 2 - 75,
      y: vp.y + vp.height / 2 - 25,
    };
    const node = {
      id: getId(),
      type: 'default',
      position: pos,
      data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
      style: { width: 150 },
    };
    setElements((els) => [...els, node]);
  };

  const onDragOver = useCallback((evt) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (evt) => {
      evt.preventDefault();
      const type = evt.dataTransfer.getData('application/reactflow');
      const bounds = document
        .querySelector('.react-flow')
        .getBoundingClientRect();
      const coords = project({
        x: evt.clientX - bounds.left,
        y: evt.clientY - bounds.top,
      });
      const node = {
        id: getId(),
        type: 'default',
        position: coords,
        data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
        style: { width: 150 },
      };
      setElements((els) => [...els, node]);
    },
    [project, setElements]
  );

  return (
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
  );
}

function App() {
  const [elements, setElements] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/topology')
      .then((r) => r.json())
      .then(({ nodes, edges }) => setElements([...nodes, ...edges]))
      .catch(console.error);
  }, []);

  // click-to-add dispatcher
  const addNode = (type) => {
    // we’ll delegate inside FlowCanvas via context
    // here we just open/close menu
    const evt = new CustomEvent('addNodeAtCenter', { detail: type });
    window.dispatchEvent(evt);
    setMenuOpen(false);
  };

  return (
    <div className="app">
      <ReactFlowProvider>
        <FlowCanvas elements={elements} setElements={setElements} />
      </ReactFlowProvider>

      <button
        className={`fab ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen((o) => !o)}
      >
        +
      </button>

      {menuOpen && (
        <div className="toolbar">
          {[
            { type: 'device', icon: deviceIcon, label: 'Device' },
            { type: 'switch', icon: switchIcon, label: 'Switch' },
            { type: 'icon'  , icon: starIcon  , label: 'Icon'   },
          ].map(({ type, icon, label }) => (
            <div
              key={type}
              className="tool"
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData('application/reactflow', type)
              }
              onClick={() => addNode(type)}
            >
              <img src={icon} alt={label} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
