import React, { useCallback, useRef } from 'react';

import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  ReactFlowProvider,
  useStoreApi,
  useReactFlow,
  Controls,
} from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';
import NoggleNode from './nodes/NoggleNode'
import NoggleEdge from './edges/NoggleEdge'
 
import { initialEdges, initialNodes } from './initialElements';
 
const MIN_DISTANCE = 150;

const nodeTypes = {
  Noggle: NoggleNode
};

const edgeTypes = {
  Noggle: NoggleEdge
}
let id = 1;
const getId = () => `${id++}`;
const Flow = () => {
  const reactFlowWrapper = useRef(null);
  const edgeReconnectSuccessful = useRef(true);
  const store = useStoreApi();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { getInternalNode } = useReactFlow();
  const { screenToFlowPosition } = useReactFlow();
 
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
 
  const getClosestEdge = useCallback((node) => {
    const { nodeLookup } = store.getState();
    const internalNode = getInternalNode(node.id);
 
    const closestNode = Array.from(nodeLookup.values()).reduce(
      (res, n) => {
        if (n.id !== internalNode.id) {
          const dx =
            n.internals.positionAbsolute.x -
            internalNode.internals.positionAbsolute.x;
          const dy =
            n.internals.positionAbsolute.y -
            internalNode.internals.positionAbsolute.y;
          const d = Math.sqrt(dx * dx + dy * dy);
 
          if (d < res.distance && d < MIN_DISTANCE) {
            res.distance = d;
            res.node = n;
          }
        }
 
        return res;
      },
      {
        distance: Number.MAX_VALUE,
        node: null,
      },
    );
 
    if (!closestNode.node) {
      return null;
    }
 
    const closeNodeIsSource =
      closestNode.node.internals.positionAbsolute.x <
      internalNode.internals.positionAbsolute.x;
 
    return {
      id: closeNodeIsSource
        ? `${closestNode.node.id}-${node.id}`
        : `${node.id}-${closestNode.node.id}`,
      source: closeNodeIsSource ? closestNode.node.id : node.id,
      target: closeNodeIsSource ? node.id : closestNode.node.id,
    };
  }, []);
 
  const onNodeDrag = useCallback(
    (_, node) => {
      const closeEdge = getClosestEdge(node);
 
      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp');
 
        if (
          closeEdge &&
          !nextEdges.find(
            (ne) =>
              ne.source === closeEdge.source && ne.target === closeEdge.target,
          )
        ) {
          closeEdge.className = 'temp';
          nextEdges.push(closeEdge);
        }
 
        return nextEdges;
      });
    },
    [getClosestEdge, setEdges],
  );
 
  const onNodeDragStop = useCallback(
    (_, node) => {
      const closeEdge = getClosestEdge(node);
 
      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp');
 
        if (
          closeEdge &&
          !nextEdges.find(
            (ne) =>
              ne.source === closeEdge.source && ne.target === closeEdge.target,
          )
        ) {
          nextEdges.push(closeEdge);
        }
 
        return nextEdges;
      });
    },
    [getClosestEdge],
  );


   
    const onConnectEnd = useCallback(
      (event, connectionState) => {
        // when a connection is dropped on the pane it's not valid
        if (!connectionState.isValid) {
          // we need to remove the wrapper bounds, in order to get the correct position
          const id = getId();
          const { clientX, clientY } =
            'changedTouches' in event ? event.changedTouches[0] : event;
          const newNode = {
            id,
            position: screenToFlowPosition({
              x: clientX,
              y: clientY,
            }),
            data: { label: `` },
            origin: [0.5, 0.0],
            type: 'Noggle'
          };
   
          setNodes((nds) => nds.concat(newNode));
          setEdges((eds) =>
            eds.concat({ id, source: connectionState.fromNode.id, target: id }),
          );
        }
      },
      [screenToFlowPosition],
    );
  
    const onReconnectStart = useCallback(() => {
      edgeReconnectSuccessful.current = false;
    }, []);
   
    const onReconnect = useCallback((oldEdge, newConnection) => {
      edgeReconnectSuccessful.current = true;
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    }, []);
   
    const onReconnectEnd = useCallback((_, edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
   
      edgeReconnectSuccessful.current = true;
    }, []);
  return (
    <div className="wrapper" ref={reactFlowWrapper} style={{ height: 800 }}>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeDrag={onNodeDrag}
      onNodeDragStop={onNodeDragStop}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onConnectEnd={onConnectEnd}
      style={{ backgroundColor: "#F7F9FB" }}
      snapToGrid
      onReconnect={onReconnect}
      onReconnectStart={onReconnectStart}
      onReconnectEnd={onReconnectEnd}
      fitView
    >
      <Background  />
      <Controls></Controls>
    </ReactFlow>
    </div>
  );
};
 
export default () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);