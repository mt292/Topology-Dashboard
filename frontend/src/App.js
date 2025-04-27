import React from 'react';
import ReactFlow, { Background, Controls } from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';
import 'react-flow-renderer/dist/theme-default.css';

function App() {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <ReactFlow nodes={[]} edges={[]} fitView>
        {/* Dotted‐grid background */}
        <Background 
          variant="dots" 
          gap={16} 
          size={1} 
          color="#999" 
        />
        {/* Zoom & pan controls in the bottom-left */}
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
