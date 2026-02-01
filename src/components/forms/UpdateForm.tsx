import { useState } from 'react';
import type { UpdateFormState } from '../../types';

interface UpdateFormProps {
  onGenerate: (state: UpdateFormState) => void;
}

export default function UpdateForm({ onGenerate }: UpdateFormProps) {
  const [state, setState] = useState<UpdateFormState>({
    table: '',
    sets: [],
  });

  const handleAddSet = () => {
    setState(prev => ({
      ...prev,
      sets: [...prev.sets, { column: '', value: '' }],
    }));
  };

  const handleRemoveSet = (index: number) => {
    setState(prev => ({
      ...prev,
      sets: prev.sets.filter((_, i) => i !== index),
    }));
  };

  const handleSetChange = (index: number, field: 'column' | 'value', value: string) => {
    setState(prev => ({
      ...prev,
      sets: prev.sets.map((set, i) =>
        i === index ? { ...set, [field]: value } : set
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.table && state.sets.length > 0) {
      onGenerate(state);
    }
  };

  const hasWhere = state.where && state.where.trim().length > 0;

  return (
    <form className="sql-form" onSubmit={handleSubmit}>
      <h3 className="form-title">UPDATE - แก้ไขข้อมูล</h3>

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
        <label>SET (Column = Value) *</label>
        <button type="button" onClick={handleAddSet} className="btn-secondary">
          + เพิ่ม SET
        </button>
      </div>

      {state.sets.map((set, idx) => (
        <div key={idx} className="column-value-row">
          <input
            type="text"
            value={set.column}
            onChange={(e) => handleSetChange(idx, 'column', e.target.value)}
            placeholder="Column name"
            required
          />
          <span>=</span>
          <input
            type="text"
            value={set.value}
            onChange={(e) => handleSetChange(idx, 'value', e.target.value)}
            placeholder="'new value'"
            required
          />
          <button
            type="button"
            onClick={() => handleRemoveSet(idx)}
            className="btn-danger-small"
          >
            ×
          </button>
        </div>
      ))}

      <div className="form-group">
        <label>WHERE (เงื่อนไข) *</label>
        <input
          type="text"
          value={state.where || ''}
          onChange={(e) => setState({ ...state, where: e.target.value })}
          placeholder="id = 1"
        />
        {!hasWhere && (
          <div className="form-warning">
            ⚠️ ไม่มี WHERE จะ UPDATE ทั้ง Table!
          </div>
        )}
      </div>

      <button type="submit" className="btn-primary" disabled={state.sets.length === 0}>
        Generate SQL
      </button>
    </form>
  );
}
