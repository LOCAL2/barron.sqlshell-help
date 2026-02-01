import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Check, AlertTriangle, Lightbulb, Info, XCircle } from 'lucide-react';
import { explainSQL } from '../utils/sqlExplainer';
import { validateSQL } from '../utils/sqlValidator';

interface SQLPreviewProps {
  command: string;
  isDangerous?: boolean;
  isFullTable?: boolean;
}

export default function SQLPreview({ command, isDangerous, isFullTable }: SQLPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  const explanation = explainSQL(command);
  const validationErrors = validateSQL(command);
  const hasErrors = validationErrors.some(e => e.type === 'error');

  const handleCopy = async () => {
    try {
      // Try modern clipboard API first
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers or when clipboard API is not available
      try {
        const textArea = document.createElement('textarea');
        textArea.value = command;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Failed to copy text: ', fallbackErr);
        alert('ไม่สามารถคัดลอกได้ กรุณาลองใหม่');
      }
    }
  };

  return (
    <div className="sql-preview">
      <div className="preview-header">
        <h3>คำสั่งที่จะ Execute</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {explanation && (
            <button 
              className={`explain-toggle-btn ${showExplanation ? 'active' : ''}`}
              onClick={() => setShowExplanation(!showExplanation)}
              title={showExplanation ? 'ซ่อนคำอธิบาย' : 'แสดงคำอธิบาย'}
            >
              <Lightbulb size={16} />
              {showExplanation ? 'ซ่อนคำอธิบาย' : 'อธิบาย AI'}
            </button>
          )}
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
          </button>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="validation-errors">
          {validationErrors.map((error, idx) => (
            <div key={idx} className={`validation-item ${error.type}`}>
              <div className="validation-header">
                {error.type === 'error' ? (
                  <XCircle size={18} />
                ) : (
                  <AlertTriangle size={18} />
                )}
                <strong>{error.type === 'error' ? '❌ Error:' : '⚠️ Warning:'}</strong>
                <span>{error.message}</span>
              </div>
              {error.suggestion && (
                <div className="validation-suggestion">
                  💡 {error.suggestion}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {(isDangerous || isFullTable) && (
        <div className="warning-banner">
          <AlertTriangle size={18} />
          <div>
            {isDangerous && <p><strong>คำสั่งอันตราย:</strong> DROP, DELETE หรือ UPDATE</p>}
            {isFullTable && <p><strong>ไม่มี WHERE:</strong> จะกระทบทั้ง Table</p>}
          </div>
        </div>
      )}

      {explanation && showExplanation && !hasErrors && (
        <div className="sql-explanation">
          <div className="explanation-summary">
            <Info size={18} />
            <strong>{explanation.summary}</strong>
          </div>
          
          <div className="explanation-details">
            {explanation.details.map((detail, idx) => (
              <div key={idx} className="detail-item">{detail}</div>
            ))}
          </div>

          {explanation.warning && (
            <div className="explanation-warning">
              <AlertTriangle size={16} />
              <span>{explanation.warning}</span>
            </div>
          )}
        </div>
      )}

      <div className="editor-container">
        <Editor
          height="200px"
          defaultLanguage="sql"
          value={command}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'off',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}
