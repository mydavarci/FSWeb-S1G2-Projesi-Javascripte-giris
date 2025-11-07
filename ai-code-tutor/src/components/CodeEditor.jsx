import { useCallback } from 'react';
import Editor from '@monaco-editor/react';
import useStore from '../store/useStore';
import './CodeEditor.css';

function CodeEditor() {
  const { currentCode, setCurrentCode } = useStore();

  const handleEditorChange = useCallback((value) => {
    setCurrentCode(value || '');
  }, [setCurrentCode]);

  return (
    <div className="panel code-editor-panel">
      <div className="panel-header">
        <h2>📝 Kod Editörü</h2>
      </div>

      <div className="panel-content">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={currentCode}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'Courier New', Courier, monospace",
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on'
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
