import React, { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls } from 'react-flow-renderer';

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    // hit your backend’s topology endpoint
    fetch('/api/topology')
      .then(res => res.json())
      .then(data => {
        // expect { nodes: [...], edges: [...] }
        setNodes(data.nodes);
        setEdges(data.edges);
      })
      .catch(err => {
        console.error('Failed to load topology:', err);
      });
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        {/* dotted grid background */}
        <Background variant="dots" gap={12} size={1} color="#aaa" />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
