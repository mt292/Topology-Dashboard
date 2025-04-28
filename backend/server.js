// backend/server.js
const fs      = require('fs');
const path    = require('path');
const https   = require('https');
const express = require('express');
const path = require('path');
const app = express();

// stub API
app.get('/api/topology', (req, res) => {
  res.json({
    nodes: [
      { id: '1', data: { label: 'Router' }, position: { x: 100, y: 100 } },
      { id: '2', data: { label: 'Switch' }, position: { x: 400, y: 100 } },
    ],
    edges: [{ id: 'e1-2', source: '1', target: '2', type: 'smoothstep' }],
  });
});

// serve React build
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const port = process.env.PORT || 443;
app.listen(port, () => console.log(`🚀 HTTPS server up on port ${port}`));

// 1) Health check (you already have this)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 2) Stub out the topology endpoint
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

// 3) Serve React’s static build
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// 4) HTTPS setup & listen
const options = {
  key:  fs.readFileSync(path.join(__dirname, '../certs/topo.key')),
  cert: fs.readFileSync(path.join(__dirname, '../certs/topo.crt')),
};
https.createServer(options, app).listen(443, () => {
  console.log('🚀 HTTPS server up on port 443');
});
