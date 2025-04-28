// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background
} from 'react-flow-renderer';
import './App.css';
import 'react-flow-renderer/dist/style.css';

function App() {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    fetch('/api/topology')
      .then((res) => res.json())
      .then(({ nodes, edges }) => {
        // react-flow wants a flat array of nodes+edges
        setElements([...nodes, ...edges]);
      })
      .catch((err) => {
        console.error('failed to load topology', err);
      });
  }, []);

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
