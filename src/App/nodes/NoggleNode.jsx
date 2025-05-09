import { useLayoutEffect, useEffect, useRef, useMemo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

// function RichTextEditor({ value, setValue }: { value: any; setValue: any }) {
//   const editor = useMemo(() => withReact(createEditor()), []);

//   return (
//     <Slate editor={editor} initialValue={value} onChange={setValue}>
//       <Editable />
//     </Slate>
//   );
// }

function NoggleNode({  id, data,}) {
  const [nodeStyle, setNodeStyle] = useState({ color: "#000000" });

  const handleNodeColorChange = (newColor) => {
    setNodeStyle((prevStyle) => ({
      ...prevStyle,
      color: newColor,  // Update the node's color
    }));
  };

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input field on mount
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 1);
  }, []);

  // Dynamically adjust the width of the input field based on the label length
  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.width = `${data.label.length * 8}px`;
    }
  }, [data.label.length]);


  return (
    <div style={{ padding: 10, background: 'white' }}>
      <input id="text" name="text" className="input" style={{width: 80, right:50}}/> 
      <Handle type="source" position={Position.Top} id="a" />
    </div>
  );
}

export default (NoggleNode);
