import { useState } from 'react';
import type { AlterTableFormState, AlterTableOperation, MySQLDataType } from '../../types';

interface AlterTableFormProps {
  onGenerate: (state: AlterTableFormState) => void;
}

const operations: { value: AlterTableOperation; label: string }[] = [
  { value: 'ADD_COLUMN', label: 'เพิ่ม Column' },
  { value: 'DROP_COLUMN', label: 'ลบ Column' },
  { value: 'MODIFY_COLUMN', label: 'แก้ไข Column Type' },
  { value: 'CHANGE_COLUMN', label: 'เปลี่ยนชื่อ Column' },
  { value: 'RENAME_TABLE', label: 'เปลี่ยนชื่อ Table' },
  { value: 'ADD_PRIMARY_KEY', label: 'เพิ่ม Primary Key' },
  { value: 'DROP_PRIMARY_KEY', label: 'ลบ Primary Key' },
  { value: 'ADD_INDEX', label: 'เพิ่ม Index' },
  { value: 'DROP_INDEX', label: 'ลบ Index' },
  { value: 'ADD_FOREIGN_KEY', label: 'เพิ่ม Foreign Key' },
];

const dataTypes: MySQLDataType[] = [
  'INT', 'BIGINT', 'VARCHAR', 'TEXT', 'DATE', 'DATETIME',
  'TIMESTAMP', 'BOOLEAN', 'DECIMAL', 'FLOAT', 'DOUBLE', 'JSON', 'ENUM'
];

export default function AlterTableForm({ onGenerate }: AlterTableFormProps) {
  const [state, setState] = useState<AlterTableFormState>({
    tableName: '',
    operation: 'ADD_COLUMN',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.tableName) {
      onGenerate(state);
    }
  };

  const renderOperationFields = () => {
    switch (state.operation) {
      case 'ADD_COLUMN':
      case 'MODIFY_COLUMN':
        return (
          <>
            <div className="form-group">
              <label>ชื่อ Column *</label>
              <input
                type="text"
                value={state.columnDef?.name || ''}
                onChange={(e) => setState({
                  ...state,
                  columnDef: { ...state.columnDef!, name: e.target.value }
                })}
                placeholder="new_column"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Data Type *</label>
                <select
                  value={state.columnDef?.type || 'VARCHAR'}
                  onChange={(e) => setState({
                    ...state,
                    columnDef: { ...state.columnDef!, type: e.target.value as MySQLDataType }
                  })}
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
                  value={state.columnDef?.length || ''}
                  onChange={(e) => setState({
                    ...state,
                    columnDef: { ...state.columnDef!, length: parseInt(e.target.value) || undefined }
                  })}
                  placeholder="255"
                />
              </div>
            </div>

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={!state.columnDef?.nullable}
                  onChange={(e) => setState({
                    ...state,
                    columnDef: { ...state.columnDef!, nullable: !e.target.checked }
                  })}
                />
                NOT NULL
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={state.columnDef?.unsigned || false}
                  onChange={(e) => setState({
                    ...state,
                    columnDef: { ...state.columnDef!, unsigned: e.target.checked }
                  })}
                />
                UNSIGNED
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={state.columnDef?.unique || false}
                  onChange={(e) => setState({
                    ...state,
                    columnDef: { ...state.columnDef!, unique: e.target.checked }
                  })}
                />
                UNIQUE
              </label>
            </div>

            <div className="form-group">
              <label>Default Value</label>
              <input
                type="text"
                value={state.columnDef?.defaultValue || ''}
                onChange={(e) => setState({
                  ...state,
                  columnDef: { ...state.columnDef!, defaultValue: e.target.value }
                })}
                placeholder="NULL, 'value', 0"
              />
            </div>
          </>
        );

      case 'DROP_COLUMN':
        return (
          <div className="form-group">
            <label>ชื่อ Column ที่จะลบ *</label>
            <input
              type="text"
              value={state.columnDef?.name || ''}
              onChange={(e) => setState({
                ...state,
                columnDef: { name: e.target.value, type: 'VARCHAR', nullable: true }
              })}
              placeholder="old_column"
              required
            />
            <div className="form-warning">⚠️ Column และข้อมูลจะถูกลบถาวร!</div>
          </div>
        );

      case 'CHANGE_COLUMN':
        return (
          <>
            <div className="form-group">
              <label>ชื่อ Column เดิม *</label>
              <input
                type="text"
                value={state.oldColumnName || ''}
                onChange={(e) => setState({ ...state, oldColumnName: e.target.value })}
                placeholder="old_name"
                required
              />
            </div>

            <div className="form-group">
              <label>ชื่อ Column ใหม่ *</label>
              <input
                type="text"
                value={state.columnDef?.name || ''}
                onChange={(e) => setState({
                  ...state,
                  columnDef: { ...state.columnDef!, name: e.target.value }
                })}
                placeholder="new_name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Data Type *</label>
                <select
                  value={state.columnDef?.type || 'VARCHAR'}
                  onChange={(e) => setState({
                    ...state,
                    columnDef: { ...state.columnDef!, type: e.target.value as MySQLDataType }
                  })}
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
                  value={state.columnDef?.length || ''}
                  onChange={(e) => setState({
                    ...state,
                    columnDef: { ...state.columnDef!, length: parseInt(e.target.value) || undefined }
                  })}
                  placeholder="255"
                />
              </div>
            </div>
          </>
        );

      case 'RENAME_TABLE':
        return (
          <div className="form-group">
            <label>ชื่อ Table ใหม่ *</label>
            <input
              type="text"
              value={state.newTableName || ''}
              onChange={(e) => setState({ ...state, newTableName: e.target.value })}
              placeholder="new_table_name"
              required
            />
          </div>
        );

      case 'ADD_PRIMARY_KEY':
        return (
          <div className="form-group">
            <label>Columns สำหรับ Primary Key *</label>
            <input
              type="text"
              value={state.primaryKeyColumns?.join(', ') || ''}
              onChange={(e) => setState({
                ...state,
                primaryKeyColumns: e.target.value.split(',').map(s => s.trim())
              })}
              placeholder="id หรือ id, user_id"
              required
            />
            <div className="form-hint">💡 ใส่หลาย Column คั่นด้วย comma</div>
          </div>
        );

      case 'DROP_PRIMARY_KEY':
        return (
          <div className="form-warning">
            ⚠️ จะลบ Primary Key ออกจาก Table นี้
          </div>
        );

      case 'ADD_INDEX':
        return (
          <>
            <div className="form-group">
              <label>ชื่อ Index *</label>
              <input
                type="text"
                value={state.indexDef?.name || ''}
                onChange={(e) => setState({
                  ...state,
                  indexDef: { ...state.indexDef!, name: e.target.value }
                })}
                placeholder="idx_column_name"
                required
              />
            </div>

            <div className="form-group">
              <label>Columns *</label>
              <input
                type="text"
                value={state.indexDef?.columns?.join(', ') || ''}
                onChange={(e) => setState({
                  ...state,
                  indexDef: {
                    ...state.indexDef!,
                    columns: e.target.value.split(',').map(s => s.trim())
                  }
                })}
                placeholder="column1, column2"
                required
              />
            </div>

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={state.indexDef?.unique || false}
                  onChange={(e) => setState({
                    ...state,
                    indexDef: { ...state.indexDef!, unique: e.target.checked }
                  })}
                />
                UNIQUE Index
              </label>
            </div>
          </>
        );

      case 'DROP_INDEX':
        return (
          <div className="form-group">
            <label>ชื่อ Index ที่จะลบ *</label>
            <input
              type="text"
              value={state.indexDef?.name || ''}
              onChange={(e) => setState({
                ...state,
                indexDef: { name: e.target.value, columns: [] }
              })}
              placeholder="idx_column_name"
              required
            />
          </div>
        );

      case 'ADD_FOREIGN_KEY':
        return (
          <>
            <div className="form-group">
              <label>ชื่อ Foreign Key *</label>
              <input
                type="text"
                value={state.foreignKeyDef?.name || ''}
                onChange={(e) => setState({
                  ...state,
                  foreignKeyDef: { ...state.foreignKeyDef!, name: e.target.value }
                })}
                placeholder="fk_table_column"
                required
              />
            </div>

            <div className="form-group">
              <label>Column ใน Table นี้ *</label>
              <input
                type="text"
                value={state.foreignKeyDef?.column || ''}
                onChange={(e) => setState({
                  ...state,
                  foreignKeyDef: { ...state.foreignKeyDef!, column: e.target.value }
                })}
                placeholder="user_id"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Reference Table *</label>
                <input
                  type="text"
                  value={state.foreignKeyDef?.referenceTable || ''}
                  onChange={(e) => setState({
                    ...state,
                    foreignKeyDef: { ...state.foreignKeyDef!, referenceTable: e.target.value }
                  })}
                  placeholder="users"
                  required
                />
              </div>

              <div className="form-group">
                <label>Reference Column *</label>
                <input
                  type="text"
                  value={state.foreignKeyDef?.referenceColumn || ''}
                  onChange={(e) => setState({
                    ...state,
                    foreignKeyDef: { ...state.foreignKeyDef!, referenceColumn: e.target.value }
                  })}
                  placeholder="id"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ON DELETE</label>
                <select
                  value={state.foreignKeyDef?.onDelete || ''}
                  onChange={(e) => setState({
                    ...state,
                    foreignKeyDef: {
                      ...state.foreignKeyDef!,
                      onDelete: e.target.value as any
                    }
                  })}
                >
                  <option value="">-- เลือก --</option>
                  <option value="CASCADE">CASCADE</option>
                  <option value="SET NULL">SET NULL</option>
                  <option value="RESTRICT">RESTRICT</option>
                  <option value="NO ACTION">NO ACTION</option>
                </select>
              </div>

              <div className="form-group">
                <label>ON UPDATE</label>
                <select
                  value={state.foreignKeyDef?.onUpdate || ''}
                  onChange={(e) => setState({
                    ...state,
                    foreignKeyDef: {
                      ...state.foreignKeyDef!,
                      onUpdate: e.target.value as any
                    }
                  })}
                >
                  <option value="">-- เลือก --</option>
                  <option value="CASCADE">CASCADE</option>
                  <option value="SET NULL">SET NULL</option>
                  <option value="RESTRICT">RESTRICT</option>
                  <option value="NO ACTION">NO ACTION</option>
                </select>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  // Initialize columnDef when needed
  if (!state.columnDef && ['ADD_COLUMN', 'MODIFY_COLUMN', 'CHANGE_COLUMN'].includes(state.operation)) {
    setState({
      ...state,
      columnDef: { name: '', type: 'VARCHAR', nullable: true }
    });
  }

  if (!state.indexDef && ['ADD_INDEX'].includes(state.operation)) {
    setState({
      ...state,
      indexDef: { name: '', columns: [] }
    });
  }

  if (!state.foreignKeyDef && ['ADD_FOREIGN_KEY'].includes(state.operation)) {
    setState({
      ...state,
      foreignKeyDef: {
        name: '',
        column: '',
        referenceTable: '',
        referenceColumn: ''
      }
    });
  }

  return (
    <form className="sql-form" onSubmit={handleSubmit}>
      <h3 className="form-title">ALTER TABLE - แก้ไขตาราง</h3>

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
        <label>ประเภทการแก้ไข *</label>
        <select
          value={state.operation}
          onChange={(e) => setState({
            tableName: state.tableName,
            operation: e.target.value as AlterTableOperation
          })}
        >
          {operations.map(op => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>
      </div>

      {renderOperationFields()}

      <button type="submit" className="btn-primary">
        Generate SQL
      </button>
    </form>
  );
}
