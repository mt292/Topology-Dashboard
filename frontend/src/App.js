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

// (1) simple icon imports – replace with your own SVGs or PNGs
import deviceIcon from './icons/device.svg';
import switchIcon from './icons/switch.svg';
import starIcon from './icons/star.svg';

// (2) custom node components
function DeviceNode({ data }) {
  return (
    <div className="custom-node">
      <img src={deviceIcon} alt="" />
      <div className="label">{data.label}</div>
    </div>
  );
}

function SwitchNode({ data }) {
  return (
    <div className="custom-node">
      <img src={switchIcon} alt="" />
      <div className="label">{data.label}</div>
    </div>
  );
}

function IconNode({ data }) {
  return (
    <div className="custom-node">
      <img src={starIcon} alt="" />
      <div className="label">{data.label}</div>
    </div>
  );
}

const nodeTypes = {
  device: DeviceNode,
  switch: SwitchNode,
  icon: IconNode,
};

// (3) ID generator for new nodes
let id = 3;
const getId = () => `node_${id++}`;

function App() {
  // core react-flow state hooks
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // which tool is active (null | 'device' | 'switch' | 'icon')
  const [toolMode, setToolMode] = useState(null);
  // show/hide the mini FAB menu
  const [menuOpen, setMenuOpen] = useState(false);

  // preview position while in add mode
  const [previewPos, setPreviewPos] = useState(null);

  // fetch initial topology once
  useEffect(() => {
    fetch('/api/topology')
      .then((r) => r.json())
      .then(({ nodes: n, edges: e }) => {
        setNodes(n);
        setEdges(e);
      })
      .catch((err) => console.error('load topology failed', err));
  }, [setNodes, setEdges]);

  // track mouse moves on the pane
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

  // place a new node on click
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
        type: toolMode,
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

  // build ghost‐node array
  const ghostNode =
    toolMode && previewPos
      ? [
          {
            id: '__preview__',
            type: toolMode,
            position: previewPos,
            data: {
              label:
                toolMode === 'device'
                  ? 'Device'
                  : toolMode === 'switch'
                  ? 'Switch'
                  : 'Icon',
            },
            style: { opacity: 0.4, pointerEvents: 'none' },
          },
        ]
      : [];

  return (
    <div className="app">
      {/* FAB + menu */}
      <div className="fab-container">
        <button
          className="fab"
          onClick={() => setMenuOpen((o) => !o)}
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

      {/* the flow canvas */}
      <ReactFlow
        nodes={[...nodes, ...ghostNode]}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(params) =>
          setEdges((eds) => addEdge(params, eds))
        }
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
