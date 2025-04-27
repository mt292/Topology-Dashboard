const express = require('express');
const path    = require('path');
const fs      = require('fs');
const https   = require('https');

const app = express();

// 1) Health endpoint
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 2) Serve React’s build folder
app.use(express.static(path.join(__dirname, '../frontend/build')));

// 3) Fallback all other GETs to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// 4) HTTPS server startup (cert/key pointed correctly)
const options = {
  key:  fs.readFileSync(path.join(__dirname, '../certs/topo.key')),
  cert: fs.readFileSync(path.join(__dirname, '../certs/topo.crt')),
};
https.createServer(options, app).listen(443, () => {
  console.log('🚀 HTTPS server up on port 443');
});
