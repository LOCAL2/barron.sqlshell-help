import { useState } from 'react';
import type { SelectFormState } from '../../types';

interface SelectFormProps {
  onGenerate: (state: SelectFormState) => void;
}

export default function SelectForm({ onGenerate }: SelectFormProps) {
  const [state, setState] = useState<SelectFormState>({
    table: '',
    columns: [],
  });

  const [columnInput, setColumnInput] = useState('');

  const handleAddColumn = () => {
    if (columnInput.trim()) {
      setState(prev => ({
        ...prev,
        columns: [...prev.columns, columnInput.trim()],
      }));
      setColumnInput('');
    }
  };

  const handleRemoveColumn = (index: number) => {
    setState(prev => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.table) {
      onGenerate(state);
    }
  };

  return (
    <form className="sql-form" onSubmit={handleSubmit}>
      <h3 className="form-title">SELECT - ค้นหาข้อมูล</h3>

      <div className="form-group">
        <label>ชื่อ Table *</label>
        <input
          type="text"
          value={state.table}
          onChange={(e) => setState({ ...state, table: e.target.value })}
          placeholder="users"
          required
        />
      </div>

      <div className="form-group">
        <label>Columns (เว้นว่างเพื่อเลือกทั้งหมด)</label>
        <div className="column-input-group">
          <input
            type="text"
            value={columnInput}
            onChange={(e) => setColumnInput(e.target.value)}
            placeholder="id, name, email"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColumn())}
          />
          <button type="button" onClick={handleAddColumn} className="btn-secondary">
            เพิ่ม
          </button>
        </div>
        {state.columns.length > 0 && (
          <div className="column-tags">
            {state.columns.map((col, idx) => (
              <span key={idx} className="tag">
                {col}
                <button type="button" onClick={() => handleRemoveColumn(idx)}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <label>WHERE (เงื่อนไข)</label>
        <input
          type="text"
          value={state.where || ''}
          onChange={(e) => setState({ ...state, where: e.target.value })}
          placeholder="id = 1 AND status = 'active'"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>ORDER BY</label>
          <input
            type="text"
            value={state.orderBy || ''}
            onChange={(e) => setState({ ...state, orderBy: e.target.value })}
            placeholder="created_at DESC"
          />
        </div>

        <div className="form-group">
          <label>LIMIT</label>
          <input
            type="number"
            value={state.limit || ''}
            onChange={(e) => setState({ ...state, limit: parseInt(e.target.value) || undefined })}
            placeholder="10"
          />
        </div>
      </div>

      <div className="form-group">
        <label>GROUP BY</label>
        <input
          type="text"
          value={state.groupBy || ''}
          onChange={(e) => setState({ ...state, groupBy: e.target.value })}
          placeholder="category"
        />
      </div>

      <div className="form-group">
        <label>HAVING</label>
        <input
          type="text"
          value={state.having || ''}
          onChange={(e) => setState({ ...state, having: e.target.value })}
          placeholder="COUNT(*) > 5"
        />
      </div>

      <button type="submit" className="btn-primary">
        Generate SQL
      </button>
    </form>
  );
}
