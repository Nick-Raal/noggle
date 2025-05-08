import React, { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
 
export default function ContextMenu({
  id,
  top,
  left,
  right,
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

  const changeNodeColor = useCallback((event) => {
    console.log("update color");
    const newColor = event.target.value;
    // Update the node's style with the new color
    setNodes((nodes) =>
      nodes.map((n) =>
        n.id === id
          ? {
              ...n,
              style: {
                ...n.style,
                color: newColor,
              },
            }
          : n
      )
    );
  }, [id, setNodes]); // Removed getNode since it's not used
 
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
      <p style={{ margin: '0.5em' }}>
        <small>node: {id}</small>
      </p>
      <button onClick={duplicateNode}>duplicate</button>
      <button onClick={deleteNode}>delete</button>
      <input
        type="color"
        onChange={changeNodeColor}
        defaultValue={getNode(id)?.style?.color || "#FFFFFF"}
      />
    </div>
  );
}