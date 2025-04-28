import React, { useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';

function App() {
  // React-Flow v10 hooks to manage node & edge state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    fetch('/api/topology')
      .then((res) => res.json())
      .then(({ nodes: fetchedNodes, edges: fetchedEdges }) => {
        console.log('🏗 topology payload:', { nodes: fetchedNodes, edges: fetchedEdges });
        setNodes(fetchedNodes);
        setEdges(fetchedEdges);
      })
      .catch((err) => console.error('failed to load topology', err));
  }, [setNodes, setEdges]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
