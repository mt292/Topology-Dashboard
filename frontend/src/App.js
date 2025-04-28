// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';
import 'react-flow-renderer/dist/theme-default.css';

import './App.css'; // see CSS below

let id = 3;
const getId = () => `${id++}`;

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    // initial stubbed nodes come from fetch
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [toolMode, setToolMode] = useState(null);
  // toolMode: null | 'device' | 'switch' | 'icon'

  // load initial topology
  useEffect(() => {
    fetch('/api/topology')
      .then((res) => res.json())
      .then(({ nodes: n, edges: e }) => {
        // ensure unique ids
        setNodes(n.map((nd) => ({ ...nd, id: nd.id })));
        setEdges(e);
      })
      .catch((err) => console.error(err));
  }, [setNodes, setEdges]);

  // handle clicks on blank canvas
  const onPaneClick = useCallback(
    (event) => {
      if (!toolMode) return;

      const bounds = event.target.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };

      const newNode = {
        id: getId(),
        data: { label: toolMode === 'device' ? 'New Device' : toolMode === 'switch' ? 'New Switch' : 'Icon' },
        position,
        // you could swap out style or even use custom nodeTypes here
      };

      setNodes((nds) => nds.concat(newNode));
      setToolMode(null);
    },
    [toolMode, setNodes]
  );

  return (
    <div className="app">
      {/* Toolbar */}
      <div className="toolbar">
        <button
          className={toolMode === 'device' ? 'active' : ''}
          onClick={() => setToolMode((m) => (m === 'device' ? null : 'device'))}
        >
          🖥 Device
        </button>
        <button
          className={toolMode === 'switch' ? 'active' : ''}
          onClick={() => setToolMode((m) => (m === 'switch' ? null : 'switch'))}
        >
          🔀 Switch
        </button>
        <button
          className={toolMode === 'icon' ? 'active' : ''}
          onClick={() => setToolMode((m) => (m === 'icon' ? null : 'icon'))}
        >
          ✨ Icon
        </button>
      </div>

      {/* React Flow */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
        onPaneClick={onPaneClick}
        fitView
      >
        <Background gap={16} />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
