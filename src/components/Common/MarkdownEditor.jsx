import React, { useState, useMemo } from 'react'
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const MarkdownEditor = ({ message = "", onChange }) => {
  // Markdown'ı HTML'ye çevir ve sanitize et
  const renderedMessage = useMemo(() => {
    if (!message) return '';
    const rawHtml = marked(message, { breaks: true }); // \n ile satır sonlarını destekle
    return DOMPurify.sanitize(rawHtml); // XSS güvenliği
  }, [message]);

  return (
    <div
        className="markdown-preview"
        style={{  color: "#e1e1e1", fontSize: "1rem" }}
      >
        <div className="system-message">
          <div dangerouslySetInnerHTML={{ __html: renderedMessage }} />
        </div>
      </div>
  )
}

export default MarkdownEditor
