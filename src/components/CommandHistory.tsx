import { Clock, Copy, Trash2 } from 'lucide-react';
import type { CommandHistory } from '../types';

interface CommandHistoryProps {
  history: CommandHistory[];
  onSelectCommand: (command: string) => void;
  onDeleteCommand: (id: string) => void;
  onClearAll: () => void;
}

export default function CommandHistory({ history, onSelectCommand, onDeleteCommand, onClearAll }: CommandHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="command-history empty">
        <Clock size={32} />
        <p>ยังไม่มีประวัติคำสั่ง</p>
      </div>
    );
  }

  return (
    <div className="command-history">
      <div className="history-header-bar">
        <h3 className="section-title">
          <Clock size={18} />
          ประวัติคำสั่ง ({history.length})
        </h3>
        <button 
          className="btn-clear-history" 
          onClick={onClearAll}
          title="ลบประวัติทั้งหมด"
        >
          <Trash2 size={14} />
          ลบทั้งหมด
        </button>
      </div>

      <div className="history-list">
        {history.slice().reverse().map((item) => (
          <div key={item.id} className="history-item">
            <div className="history-header">
              <span className="history-type">{item.type}</span>
              <span className="history-time">
                {new Date(item.timestamp).toLocaleTimeString('th-TH')}
              </span>
            </div>
            <div className="history-command">
              <code>{item.command}</code>
              <div className="history-actions">
                <button
                  className="history-copy"
                  onClick={() => onSelectCommand(item.command)}
                  title="ใช้คำสั่งนี้อีกครั้ง"
                >
                  <Copy size={13} />
                </button>
                <button
                  className="history-delete"
                  onClick={() => onDeleteCommand(item.id)}
                  title="ลบคำสั่งนี้"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
