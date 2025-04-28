import React, { useState, useEffect } from 'react';
import ReactFlow, { Controls, MiniMap, Background } from 'react-flow-renderer';
import './App.css';

function App() {
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/topology')
      .then((res) => res.json())
      .then(({ nodes, edges }) => {
        // React Flow expects a single array of node and edge objects:
        setElements([...nodes, ...edges]);
      })
      .catch((err) => {
        console.error('failed to load topology', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading topology…</div>;

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow elements={elements}>
        <MiniMap />
        <Controls />
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
}

export default App;
