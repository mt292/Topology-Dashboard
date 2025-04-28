const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 80;

// Stub out /api/topology
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

// Serve React static files
const buildDir = path.join(__dirname, '../frontend/build');
app.use(express.static(buildDir));

// All other requests go to React app
app.get('/*', (req, res) => {
  res.sendFile(path.join(buildDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 HTTP server up on port ${port}`);
});
