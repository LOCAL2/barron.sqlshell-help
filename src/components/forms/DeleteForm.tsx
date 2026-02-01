import { useState } from 'react';
import type { DeleteFormState } from '../../types';

interface DeleteFormProps {
  onGenerate: (state: DeleteFormState) => void;
}

export default function DeleteForm({ onGenerate }: DeleteFormProps) {
  const [state, setState] = useState<DeleteFormState>({
    table: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.table) {
      onGenerate(state);
    }
  };

  const hasWhere = state.where && state.where.trim().length > 0;

  return (
    <form className="sql-form" onSubmit={handleSubmit}>
      <h3 className="form-title">DELETE - ลบข้อมูล</h3>

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
        <label>WHERE (เงื่อนไข) *</label>
        <input
          type="text"
          value={state.where || ''}
          onChange={(e) => setState({ ...state, where: e.target.value })}
          placeholder="id = 1"
        />
        {!hasWhere && (
          <div className="form-warning">
            ⚠️ ไม่มี WHERE จะลบทั้ง Table!
          </div>
        )}
      </div>

      <button type="submit" className="btn-primary">
        Generate SQL
      </button>
    </form>
  );
}
