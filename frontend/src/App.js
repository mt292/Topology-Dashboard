import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  MiniMap,
  Controls,
  useReactFlow,
} from 'react-flow-renderer';
import './App.css';

// import your icons (or point these at /device.svg etc)
import deviceIcon from './icons/device.svg';
import switchIcon from './icons/switch.svg';
import starIcon   from './icons/star.svg';

let id = 3;
const getId = () => `${id++}`;

function App() {
  const [elements, setElements] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { project, getViewport } = useReactFlow();

  // load initial topology
  useEffect(() => {
    fetch('/api/topology')
      .then((r) => r.json())
      .then(({ nodes, edges }) => {
        setElements([...nodes, ...edges]);
      })
      .catch((err) => console.error(err));
  }, []);

  // click-to-add helper: center of viewport
  const addNodeAtCenter = (type) => {
    const vp = getViewport();
    const centerX = vp.x + vp.width  / 2;
    const centerY = vp.y + vp.height / 2;
    const newNode = {
      id: getId(),
      type: 'default',
      position: { x: centerX - 75, y: centerY - 25 },
      data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
      style: { width: 150 },
    };
    setElements((els) => els.concat(newNode));
    setMenuOpen(false);
  };

  // drag-and-drop handlers
  const onDragOver = useCallback((evt) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (evt) => {
      evt.preventDefault();
      const type = evt.dataTransfer.getData('application/reactflow');
      const { top, left } = document
        .querySelector('.react-flow')
        .getBoundingClientRect();
      const position = project({
        x: evt.clientX - left,
        y: evt.clientY - top,
      });
      const newNode = {
        id: getId(),
        type: 'default',
        position,
        data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
        style: { width: 150 },
      };
      setElements((els) => els.concat(newNode));
      setMenuOpen(false);
    },
    [project]
  );

  return (
    <div className="app">
      {/* React Flow canvas */}
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

      {/* Floating + button */}
      <button
        className={`fab ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen((o) => !o)}
      >
        +
      </button>

      {/* Pop-out toolbar */}
      {menuOpen && (
        <div className="toolbar">
          <div
            className="tool"
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData('application/reactflow', 'device')
            }
            onClick={() => addNodeAtCenter('device')}
          >
            <img src={deviceIcon} alt="Device" />
            <span>Device</span>
          </div>
          <div
            className="tool"
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData('application/reactflow', 'switch')
            }
            onClick={() => addNodeAtCenter('switch')}
          >
            <img src={switchIcon} alt="Switch" />
            <span>Switch</span>
          </div>
          <div
            className="tool"
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData('application/reactflow', 'icon')
            }
            onClick={() => addNodeAtCenter('icon')}
          >
            <img src={starIcon} alt="Icon" />
            <span>Icon</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
