import React, { useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges
} from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // on mount: fetch topology
  useEffect(() => {
    fetch('/api/topology')
      .then((r) => r.json())
      .then(({ nodes, edges }) => {
        setNodes(nodes);
        setEdges(edges);
      })
      .catch((err) => console.error('failed to load topology', err));
  }, []);

  // handlers if you want to allow drag/drop etc.
  const onNodesChange = (changes) =>
    setNodes((nds) => applyNodeChanges(changes, nds));
  const onEdgesChange = (changes) =>
    setEdges((eds) => applyEdgeChanges(changes, eds));

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
