// src/App.js
import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import './App.css';

let id = 3;
const getId = () => `node_${id++}`;

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [toolMode, setToolMode] = useState(null); // 'device'|'switch'|'icon'
  const [menuOpen, setMenuOpen] = useState(false);

  // For ghost preview
  const [previewPos, setPreviewPos] = useState(null);

  useEffect(() => {
    fetch('/api/topology')
      .then((r) => r.json())
      .then(({ nodes: n, edges: e }) => {
        setNodes(n);
        setEdges(e);
      })
      .catch(console.error);
  }, [setNodes, setEdges]);

  const onPaneMove = useCallback(
    (event) => {
      if (!toolMode) return;
      const bounds = event.target.getBoundingClientRect();
      setPreviewPos({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
    },
    [toolMode]
  );

  const onPaneClick = useCallback(
    (event) => {
      if (!toolMode || !previewPos) return;
      const label =
        toolMode === 'device'
          ? 'Device'
          : toolMode === 'switch'
          ? 'Switch'
          : 'Icon';
      const newNode = {
        id: getId(),
        type: toolMode,    // we’ll hook this up to custom nodeTypes next
        position: previewPos,
        data: { label },
      };
      setNodes((nds) => nds.concat(newNode));
      setToolMode(null);
      setMenuOpen(false);
      setPreviewPos(null);
    },
    [toolMode, previewPos, setNodes]
  );

  // Build a “ghost” node when toolMode is active
  const ghostNode =
    toolMode && previewPos
      ? [
          {
            id: '__preview__',
            type: toolMode,
            position: previewPos,
            data: { label: toolMode === 'device' ? 'Device' : toolMode === 'switch' ? 'Switch' : 'Icon' },
            style: { opacity: 0.5, pointerEvents: 'none' },
          },
        ]
      : [];

  return (
    <div className="app">
      <div className="fab-container">
        <button
          className="fab"
          onClick={() => setMenuOpen((o) => !o)}
          title="Add node"
        >
          ＋
        </button>
        {menuOpen && (
          <div className="fab-menu">
            <button
              className={toolMode === 'device' ? 'active' : ''}
              onClick={() => setToolMode('device')}
            >
              🖥 Device
            </button>
            <button
              className={toolMode === 'switch' ? 'active' : ''}
              onClick={() => setToolMode('switch')}
            >
              🔀 Switch
            </button>
            <button
              className={toolMode === 'icon' ? 'active' : ''}
              onClick={() => setToolMode('icon')}
            >
              ✨ Icon
            </button>
          </div>
        )}
      </div>

      <ReactFlow
        nodes={[...nodes, ...ghostNode]}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(p) => setEdges((eds) => addEdge(p, eds))}
        onPaneClick={onPaneClick}
        onPaneMouseMove={onPaneMove}
        fitView
      >
        <Background gap={16} />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
