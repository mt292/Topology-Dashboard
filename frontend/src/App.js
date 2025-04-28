// src/App.js
import React, { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';

function App() {
  const [elements, setElements] = useState([]);

  // load topology from the backend
  useEffect(() => {
    fetch('/api/topology')
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(({ nodes, edges }) => {
        // React Flow wants a single array of node+edge elements
        setElements([...nodes, ...edges]);
      })
      .catch((err) => {
        console.error('failed to load topology', err);
      });
  }, []);

  const onElementsRemove = useCallback(
    (elementsToRemove) =>
      setElements((els) =>
        els.filter((e) => !elementsToRemove.includes(e))
      ),
    []
  );

  const onConnect = useCallback(
    (connection) =>
      setElements((els) => [...els, connection]),
    []
  );

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <ReactFlow
        elements={elements}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        deleteKeyCode={46} /* 'delete'-key */
        fitView
      >
        <Background gap={16} size={1} color="#aaa" />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
