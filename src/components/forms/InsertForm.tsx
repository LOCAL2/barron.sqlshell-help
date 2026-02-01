import { useState } from 'react';
import type { InsertFormState } from '../../types';

interface InsertFormProps {
  onGenerate: (state: InsertFormState) => void;
}

export default function InsertForm({ onGenerate }: InsertFormProps) {
  const [state, setState] = useState<InsertFormState>({
    table: '',
    columns: [],
  });
  const [bulkColumns, setBulkColumns] = useState('');

  const handleAddColumn = () => {
    setState(prev => ({
      ...prev,
      columns: [...prev.columns, { name: '', value: '' }],
    }));
  };

  const handleAddBulkColumns = () => {
    if (!bulkColumns.trim()) return;
    
    const columnNames = bulkColumns
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    const newColumns = columnNames.map(name => ({ name, value: '' }));
    
    setState(prev => ({
      ...prev,
      columns: [...prev.columns, ...newColumns],
    }));
    
    setBulkColumns('');
  };

  const handleRemoveColumn = (index: number) => {
    setState(prev => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== index),
    }));
  };

  const handleColumnChange = (index: number, field: 'name' | 'value', value: string) => {
    setState(prev => ({
      ...prev,
      columns: prev.columns.map((col, i) =>
        i === index ? { ...col, [field]: value } : col
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.table && state.columns.length > 0) {
      onGenerate(state);
    }
  };

  return (
    <form className="sql-form" onSubmit={handleSubmit}>
      <h3 className="form-title">INSERT - เพิ่มข้อมูล</h3>

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
        <label>Columns และ Values *</label>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button type="button" onClick={handleAddColumn} className="btn-secondary">
            + เพิ่ม Column ทีละอัน
          </button>
        </div>
        
        <div className="form-hint" style={{ marginBottom: '0.5rem' }}>
          💡 หรือเพิ่มหลาย Column พร้อมกัน (คั่นด้วย comma)
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={bulkColumns}
            onChange={(e) => setBulkColumns(e.target.value)}
            placeholder="username, password, nickname, age"
            style={{ flex: 1 }}
          />
          <button 
            type="button" 
            onClick={handleAddBulkColumns} 
            className="btn-secondary"
            disabled={!bulkColumns.trim()}
          >
            เพิ่มทั้งหมด
          </button>
        </div>
      </div>

      {state.columns.map((col, idx) => (
        <div key={idx} className="column-value-row">
          <input
            type="text"
            value={col.name}
            onChange={(e) => handleColumnChange(idx, 'name', e.target.value)}
            placeholder="Column name"
            required
          />
          <input
            type="text"
            value={col.value}
            onChange={(e) => handleColumnChange(idx, 'value', e.target.value)}
            placeholder="'value' หรือ 123"
            required
          />
          <button
            type="button"
            onClick={() => handleRemoveColumn(idx)}
            className="btn-danger-small"
          >
            ×
          </button>
        </div>
      ))}

      <div className="form-hint">
        💡 ใส่ค่า String ด้วย 'single quotes' เช่น 'John Doe'
      </div>

      <button type="submit" className="btn-primary" disabled={state.columns.length === 0}>
        Generate SQL
      </button>
    </form>
  );
}
