import { useState } from 'react';
import type { SelectFormState, JoinClause } from '../../types';

interface SelectFormProps {
  onGenerate: (state: SelectFormState) => void;
  initialJoinType?: 'INNER' | 'LEFT' | 'RIGHT' | 'CROSS' | 'SELF';
  formTitle?: string;
  showJoinSection?: boolean;
}

export default function SelectForm({ onGenerate, initialJoinType, formTitle, showJoinSection = true }: SelectFormProps) {
  const [state, setState] = useState<SelectFormState>({
    table: '',
    columns: [],
    joins: initialJoinType ? [{ type: initialJoinType, table: '', on: '' }] : [],
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

  const handleAddJoin = () => {
    setState(prev => ({
      ...prev,
      joins: [...(prev.joins || []), { type: 'INNER', table: '', on: '' }],
    }));
  };

  const handleRemoveJoin = (index: number) => {
    setState(prev => ({
      ...prev,
      joins: prev.joins?.filter((_, i) => i !== index),
    }));
  };

  const handleJoinChange = (index: number, field: keyof JoinClause, value: any) => {
    setState(prev => ({
      ...prev,
      joins: prev.joins?.map((join, i) =>
        i === index ? { ...join, [field]: value } : join
      ),
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
      <h3 className="form-title">{formTitle || 'SELECT - ค้นหาข้อมูล'}</h3>

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

      {/* JOIN Section */}
      {showJoinSection && (
        <>
          <div className="form-group">
            <label>JOIN (เชื่อมตาราง)</label>
            <button type="button" onClick={handleAddJoin} className="btn-secondary">
              + เพิ่ม JOIN
            </button>
          </div>

          {state.joins && state.joins.length > 0 && (
        <div className="joins-container">
          {state.joins.map((join, idx) => (
            <div key={idx} className="join-item">
              <div className="join-header">
                <strong>JOIN {idx + 1}</strong>
                <button
                  type="button"
                  onClick={() => handleRemoveJoin(idx)}
                  className="btn-danger-small"
                >
                  ลบ
                </button>
              </div>

              <div className="form-group">
                <label>ประเภท JOIN</label>
                <select
                  value={join.type}
                  onChange={(e) => handleJoinChange(idx, 'type', e.target.value)}
                >
                  <option value="INNER">INNER JOIN (เอาแค่ที่ตรงกัน)</option>
                  <option value="LEFT">LEFT JOIN (เอาซ้ายทั้งหมด)</option>
                  <option value="RIGHT">RIGHT JOIN (เอาขวาทั้งหมด)</option>
                  <option value="CROSS">CROSS JOIN (ทุกคู่ที่เป็นไปได้)</option>
                  <option value="SELF">SELF JOIN (เชื่อมตารางตัวเอง)</option>
                </select>
              </div>

              <div className="form-group">
                <label>ชื่อ Table ที่จะ JOIN</label>
                <input
                  type="text"
                  value={join.table}
                  onChange={(e) => handleJoinChange(idx, 'table', e.target.value)}
                  placeholder="orders"
                  required
                />
              </div>

              {join.type === 'SELF' && (
                <div className="form-group">
                  <label>Alias (ชื่อเล่น)</label>
                  <input
                    type="text"
                    value={join.alias || ''}
                    onChange={(e) => handleJoinChange(idx, 'alias', e.target.value)}
                    placeholder="users_manager"
                  />
                  <div className="form-hint">💡 ใช้แยกตารางเดียวกันออกจากกัน</div>
                </div>
              )}

              {join.type !== 'CROSS' && (
                <div className="form-group">
                  <label>เงื่อนไข ON</label>
                  <input
                    type="text"
                    value={join.on || ''}
                    onChange={(e) => handleJoinChange(idx, 'on', e.target.value)}
                    placeholder="users.id = orders.user_id"
                    required={join.type !== 'CROSS'}
                  />
                  <div className="form-hint">💡 ระบุว่าจะเชื่อมด้วย column ไหน</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
        </>
      )}

      <div className="form-group">
        <label>WHERE (เงื่อนไข)</label>
        <input
          type="text"
          value={state.where || ''}
          onChange={(e) => setState({ ...state, where: e.target.value })}
          placeholder="users.status = 'active'"
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
