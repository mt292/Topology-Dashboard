#!/usr/bin/env node
const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');

// 1) Stub out your topology API
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

// 2) Serve the React build
const buildDir = path.join(__dirname, '../frontend/build');
app.use(express.static(buildDir));

// 3) For any other route, send back React’s index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(buildDir, 'index.html'));
});

// 4) (Optional) Your existing healthcheck:
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const https = require('https');
const fs = require('fs');

const options = {
  key:  fs.readFileSync(__dirname + '/certs/server-key.pem'),
  cert: fs.readFileSync(__dirname + '/certs/server-cert.pem'),
};

const PORT = process.env.PORT || 443;
https
  .createServer(options, app)
  .listen(PORT, () => console.log(`🔒 HTTPS server listening on port ${PORT}`));
