import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'

const MarkdownEditor = ({ value = "", onChange }) => {
  const [text, setText] = useState(value)
  const handleChange = (e) => {
    setText(e.target.value)
    onChange && onChange(e.target.value)
  }
  return (
    <div className="markdown-editor">
      {/* <textarea
        value={text}
        onChange={handleChange}
        placeholder="Enter markdown..."
        style={{ width: "100%", height: "200px", padding: "10px", fontSize: "14px" }}
      /> */}
      <div 
        className="markdown-preview" 
        style={{ padding: "10px", marginTop: "10px" ,color:"#b4b4b4", fontSize:"0.875rem" }}
      >
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  )
}

export default MarkdownEditor
