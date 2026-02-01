import { useState } from 'react';
import type { CreateTableFormState, ColumnDefinition, MySQLDataType } from '../../types';

interface CreateTableFormProps {
  onGenerate: (state: CreateTableFormState) => void;
}

const dataTypes: MySQLDataType[] = [
  'INT', 'BIGINT', 'VARCHAR', 'TEXT', 'DATE', 'DATETIME', 
  'TIMESTAMP', 'BOOLEAN', 'DECIMAL', 'FLOAT', 'DOUBLE', 'JSON', 'ENUM'
];

export default function CreateTableForm({ onGenerate }: CreateTableFormProps) {
  const [state, setState] = useState<CreateTableFormState>({
    tableName: '',
    columns: [],
  });

  const handleAddColumn = () => {
    setState(prev => ({
      ...prev,
      columns: [
        ...prev.columns,
        {
          name: '',
          type: 'VARCHAR',
          nullable: true,
        },
      ],
    }));
  };

  const handleRemoveColumn = (index: number) => {
    setState(prev => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== index),
    }));
  };

  const handleColumnChange = (index: number, field: keyof ColumnDefinition, value: any) => {
    setState(prev => ({
      ...prev,
      columns: prev.columns.map((col, i) =>
        i === index ? { ...col, [field]: value } : col
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.tableName && state.columns.length > 0) {
      onGenerate(state);
    }
  };

  return (
    <form className="sql-form" onSubmit={handleSubmit}>
      <h3 className="form-title">CREATE TABLE - สร้างตาราง</h3>

      <div className="form-group">
        <label>ชื่อ Table *</label>
        <input
          type="text"
          value={state.tableName}
          onChange={(e) => setState({ ...state, tableName: e.target.value })}
          placeholder="users"
          required
        />
      </div>

      <div className="form-group">
        <label>Columns *</label>
        <button type="button" onClick={handleAddColumn} className="btn-secondary">
          + เพิ่ม Column
        </button>
      </div>

      {state.columns.map((col, idx) => (
        <div key={idx} className="column-definition">
          <div className="column-header">
            <strong>Column {idx + 1}</strong>
            <button
              type="button"
              onClick={() => handleRemoveColumn(idx)}
              className="btn-danger-small"
            >
              ลบ
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>ชื่อ Column</label>
              <input
                type="text"
                value={col.name}
                onChange={(e) => handleColumnChange(idx, 'name', e.target.value)}
                placeholder="id"
                required
              />
            </div>

            <div className="form-group">
              <label>Data Type</label>
              <select
                value={col.type}
                onChange={(e) => handleColumnChange(idx, 'type', e.target.value as MySQLDataType)}
              >
                {dataTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Length</label>
              <input
                type="number"
                value={col.length || ''}
                onChange={(e) => handleColumnChange(idx, 'length', parseInt(e.target.value) || undefined)}
                placeholder="255"
              />
            </div>
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={!col.nullable}
                onChange={(e) => handleColumnChange(idx, 'nullable', !e.target.checked)}
              />
              NOT NULL
            </label>

            <label>
              <input
                type="checkbox"
                checked={col.autoIncrement || false}
                onChange={(e) => handleColumnChange(idx, 'autoIncrement', e.target.checked)}
              />
              AUTO_INCREMENT
            </label>

            <label>
              <input
                type="checkbox"
                checked={col.unsigned || false}
                onChange={(e) => handleColumnChange(idx, 'unsigned', e.target.checked)}
              />
              UNSIGNED
            </label>

            <label>
              <input
                type="checkbox"
                checked={col.unique || false}
                onChange={(e) => handleColumnChange(idx, 'unique', e.target.checked)}
              />
              UNIQUE
            </label>
          </div>

          <div className="form-group">
            <label>Default Value</label>
            <input
              type="text"
              value={col.defaultValue || ''}
              onChange={(e) => handleColumnChange(idx, 'defaultValue', e.target.value)}
              placeholder="NULL, 'value', 0"
            />
          </div>
        </div>
      ))}

      {state.columns.length > 0 && (
        <>
          <div className="form-group">
            <label>Primary Key (ไม่บังคับ)</label>
            <div className="form-hint">💡 เลือก Column ที่จะเป็น Primary Key</div>
            <select
              value={state.primaryKey?.[0] || ''}
              onChange={(e) => {
                setState(prev => ({
                  ...prev,
                  primaryKey: e.target.value ? [e.target.value] : undefined
                }));
              }}
            >
              <option value="">-- ไม่ต้องการ Primary Key --</option>
              {state.columns.map((col, idx) => (
                <option key={idx} value={col.name}>
                  {col.name || `Column ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <button type="submit" className="btn-primary" disabled={state.columns.length === 0}>
        Generate SQL
      </button>
    </form>
  );
}
