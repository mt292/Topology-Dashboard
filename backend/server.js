// backend/server.js

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;

// 1️⃣ Stub out /api/topology
app.get('/api/topology', (req, res) => {
  res.json({
    nodes: [
      { id: '1', data: { label: 'Router' }, position: { x: 100, y: 100 } },
      { id: '2', data: { label: 'Switch' }, position: { x: 400, y: 100 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
    ],
  });
});

// 2️⃣ Serve React’s static build output
const buildDir = path.join(__dirname, '../frontend/build');
app.use(express.static(buildDir));

// 3️⃣ All other GETs return React’s index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(buildDir, 'index.html'));
});

// 4️⃣ Start HTTP server
app.listen(PORT, () => {
  console.log(`🚀 HTTP server up on port ${PORT}`);
});
