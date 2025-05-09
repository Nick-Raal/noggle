import React, { useCallback, useState } from 'react';
import { useReactFlow } from '@xyflow/react';

export default function ContextMenu({
  id,
  top,
  left,
  right,
  onClick,
  bottom,
  ...props
}) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();

  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };
    
    addNodes({
      ...node,
      selected: false,
      dragging: false,
      id: `${node.id}-copy`,
      position,
    });
  }, [id, getNode, addNodes]);

  const changeNodeColor = useCallback((value) => {
    const newColor = value;
    // Update the node's style with the new color
    setNodes((nodes) =>
      nodes.map((n) => {
        if (n.id === id) {
          // Debug: Log the node we're updating
          console.log("Updating node:", n);
          
          // In ReactFlow, node styling can depend on your setup
          // Try updating both backgroundColor and color
          return {
            ...n,
            data: {
              ...n.data,
              color: newColor, // If you store color in node.data
            },
            style: {
              ...n.style,
              backgroundColor: newColor, // Common for node background
              borderColor: newColor,     // For the border
              color: newColor,           // For text color
            },
          };
        }
        return n;
      })
    );
    
  }, [id, setNodes, getNode]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);
 
  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
    >
      <button onClick={onClick} >
        Close
      </button>
      <p style={{ margin: '0.5em' }}>
        <small>node: {id}</small>
      </p>
      <button onClick={duplicateNode}>duplicate</button>
      <button onClick={deleteNode}>delete</button>
      <input
        type="color"
        onChange={(e) => changeNodeColor(e.target.value)}
        defaultValue={getNode(id).data.color || "#ffffff"}
      />
    </div>
  );
}