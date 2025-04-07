import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';

interface CodePreviewProps {
  code: string;
  language?: string;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
}

export default function CodePreview({ 
  code, 
  language = 'javascript', 
  fontFamily,
  fontSize,
  textColor,
  backgroundColor
}: CodePreviewProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  // Detect if the content is code
  const isCode = (text: string): boolean => {
    // Simple heuristic: check for common code patterns
    const codePatterns = [
      /function\s+\w+\s*\(/,  // function declarations
      /const\s+\w+\s*=/,      // const declarations
      /let\s+\w+\s*=/,        // let declarations
      /var\s+\w+\s*=/,        // var declarations
      /class\s+\w+/,          // class declarations
      /import\s+.*from/,      // import statements
      /export\s+/,            // export statements
      /if\s*\(.+\)\s*{/,      // if statements
      /for\s*\(.+\)\s*{/,     // for loops
      /while\s*\(.+\)\s*{/,   // while loops
      /^\s*<.+>.*<\/.+>$/m,   // HTML/JSX tags
      /^\s*#include/m,        // C/C++ include
      /^\s*package\s+\w+;/m,  // Java package
      /^\s*import\s+[\w.]+;/m, // Java import
      /^\s*def\s+\w+\s*\(/m,  // Python function
      /^\s*@\w+/m,            // Python/Java decorators
    ];

    return codePatterns.some(pattern => pattern.test(text));
  };

  // Try to detect the language
  const detectLanguage = (text: string): string => {
    if (text.includes('function') || text.includes('const') || text.includes('let') || 
        text.includes('var') || text.includes('=>')) {
      return 'javascript';
    } else if (text.includes('interface') || text.includes('type ') || text.includes(':') || 
               text.includes('<T>')) {
      return 'typescript';
    } else if (text.includes('<div') || text.includes('<span') || text.includes('</') || 
               text.includes('className=')) {
      return text.includes('import React') ? 'jsx' : 'html';
    } else if (text.includes('def ') || text.includes('import ') && text.includes(':')) {
      return 'python';
    } else if (text.includes('class ') && text.includes('public ')) {
      return 'java';
    } else if (text.includes('#include') || text.includes('int main(')) {
      return text.includes('std::') ? 'cpp' : 'c';
    } else if (text.includes('package ') && text.includes('func ')) {
      return 'go';
    } else if (text.includes('fn ') && text.includes('let mut ')) {
      return 'rust';
    } else if (text.includes('namespace') && text.includes('using ')) {
      return 'csharp';
    } else if (text.startsWith('{') || text.startsWith('[')) {
      try {
        JSON.parse(text);
        return 'json';
      } catch {
        // Not valid JSON
      }
    }
    
    return 'javascript'; // Default
  };

  const detectedLanguage = isCode(code) ? detectLanguage(code) : 'text';

  return (
    <div 
      className="code-preview-container overflow-auto rounded-lg"
      style={{ 
        backgroundColor,
        maxHeight: '100%',
        width: '100%',
      }}
    >
      <pre 
        className="p-4 overflow-auto"
        style={{ 
          fontFamily,
          fontSize: `${fontSize}px`,
          color: textColor,
          backgroundColor: 'transparent',
          margin: 0,
        }}
      >
        <code className={`language-${detectedLanguage}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}