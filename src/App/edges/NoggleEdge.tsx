import { BaseEdge, BezierEdge, EdgeProps, getStraightPath } from '@xyflow/react';
 
function NoggleEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY } = props;
 
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
 
  return <BaseEdge path={edgePath} type="simplebezier" style={{
    stroke: '#000',        // or your desired color
    strokeWidth: 40,        // increase thickness here
  }} {...props} />;
}
 
export default NoggleEdge;