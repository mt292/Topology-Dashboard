import React, { useState, useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';

function App() {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    fetch('/api/topology')
      .then((res) => res.json())
      .then(({ nodes, edges }) => {
        // React Flow expects a single array of nodes + edges
        setElements([...nodes, ...edges]);
      })
      .catch((err) => console.error('failed to load topology', err));
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow elements={elements}>
        <Background gap={16} />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
