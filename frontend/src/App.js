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
import './App.css';

let id = 3;
const getId = () => `node_${id++}`;

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [toolMode, setToolMode] = useState(null);       // 'device' | 'switch' | 'icon'
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch the initial topology stub
  useEffect(() => {
    fetch('/api/topology')
      .then((r) => r.json())
      .then(({ nodes: n, edges: e }) => {
        setNodes(n.map((nd) => ({ ...nd, id: nd.id })));
        setEdges(e);
      })
      .catch(console.error);
  }, [setNodes, setEdges]);

  // When you click on the blank pane and a tool is selected, drop a node
  const onPaneClick = useCallback(
    (event) => {
      if (!toolMode) return;
      const bounds = event.target.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };

      const label =
        toolMode === 'device'
          ? 'New Device'
          : toolMode === 'switch'
          ? 'New Switch'
          : 'New Icon';

      const newNode = {
        id: getId(),
        data: { label },
        position,
      };

      setNodes((nds) => nds.concat(newNode));
      setToolMode(null);
      setMenuOpen(false);
    },
    [toolMode, setNodes]
  );

  return (
    <div className="app">
      {/* Floating “＋” button */}
      <div className="fab-container">
        <button
          className="fab"
          onClick={() => setMenuOpen((open) => !open)}
          title="Add node"
        >
          ＋
        </button>

        {menuOpen && (
          <div className="fab-menu">
            <button
              className={toolMode === 'device' ? 'active' : ''}
              onClick={() => setToolMode('device')}
            >
              🖥︎ Device
            </button>
            <button
              className={toolMode === 'switch' ? 'active' : ''}
              onClick={() => setToolMode('switch')}
            >
              🔀 Switch
            </button>
            <button
              className={toolMode === 'icon' ? 'active' : ''}
              onClick={() => setToolMode('icon')}
            >
              ✨ Icon
            </button>
          </div>
        )}
      </div>

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
