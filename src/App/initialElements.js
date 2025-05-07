import { Position } from '@xyflow/react';
 
const nodeDefaults = {
  
};
 
const initialNodes = [
  {
    id: '0',
    type: 'Noggle',
    position: { x: 0, y: 0 },
    data: {
      label: 'bruh',
    },
    ...nodeDefaults,
  },
];
 
const initialEdges = [

];
 
export { initialEdges, initialNodes };