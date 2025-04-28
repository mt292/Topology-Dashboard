import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// ⚠️ corrected package name for CSS:
import 'react-flow-renderer/dist/style.css';
import 'react-flow-renderer/dist/theme-default.css';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
