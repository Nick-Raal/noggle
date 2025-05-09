import React, { type FC } from 'react';
import {
  MarkerType,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  type EdgeProps,
  type Edge,
  useInternalNode,
} from '@xyflow/react';

import { getEdgeParams } from '../initialElements.js';
 
const NoggleEdge: FC<EdgeProps<Edge<{ label:string }>>> = ({
  id,
  source,
  target,
  data,
}) => {

  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
  );



  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  <svg style={{ height: 0 }}>
  <defs>
    <marker
      id="arrow"
      viewBox="0 0 10 10"
      refX="10"
      refY="5"
      markerWidth="8"
      markerHeight="8"
      orient="auto-start-reverse"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
    </marker>
  </defs>
</svg>

  return (
    <path
      id={id}
      d={edgePath}
      markerEnd={MarkerType.Arrow} // This references the marker defined above
      style={{
      stroke:'black',           // Or any color you want
      strokeWidth:2,          // Increase for thicker lines
      fill:"none"}}              // Ensure no fill
    />
  );
};
 
export default NoggleEdge;