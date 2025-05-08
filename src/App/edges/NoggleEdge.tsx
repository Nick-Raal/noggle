import React, { type FC } from 'react';
import {
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  type EdgeProps,
  type Edge,
  useInternalNode
} from '@xyflow/react';

import { getEdgeParams } from '../initialElements.js';
 
const NoggleEdge: FC<EdgeProps<Edge<{ label:string }>>> = ({
  id,
  source,
  target,
  sourcePosition,
  targetPosition,
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
 
  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
    />
  );
};
 
export default NoggleEdge;