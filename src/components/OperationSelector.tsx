import { Database, Table, Edit, Search } from 'lucide-react';
import type { SQLOperation } from '../types';

interface OperationSelectorProps {
  selectedOperation: SQLOperation | null;
  onSelectOperation: (operation: SQLOperation) => void;
}

const operations = [
  {
    category: 'Database',
    icon: Database,
    items: [
      { id: 'CREATE_DATABASE' as SQLOperation, label: 'สร้าง Database', color: '#10b981' },
      { id: 'DROP_DATABASE' as SQLOperation, label: 'ลบ Database', color: '#ef4444' },
    ],
  },
  {
    category: 'Table',
    icon: Table,
    items: [
      { id: 'CREATE_TABLE' as SQLOperation, label: 'สร้าง Table', color: '#3b82f6' },
      { id: 'DROP_TABLE' as SQLOperation, label: 'ลบ Table', color: '#ef4444' },
      { id: 'ALTER_TABLE' as SQLOperation, label: 'แก้ไข Table', color: '#f59e0b' },
    ],
  },
  {
    category: 'Data',
    icon: Edit,
    items: [
      { id: 'INSERT' as SQLOperation, label: 'เพิ่มข้อมูล (INSERT)', color: '#10b981' },
      { id: 'UPDATE' as SQLOperation, label: 'แก้ไขข้อมูล (UPDATE)', color: '#f59e0b' },
      { id: 'DELETE' as SQLOperation, label: 'ลบข้อมูล (DELETE)', color: '#ef4444' },
    ],
  },
  {
    category: 'Query',
    icon: Search,
    items: [
      { id: 'SELECT' as SQLOperation, label: 'ค้นหาข้อมูล (SELECT)', color: '#8b5cf6' },
    ],
  },
];

export default function OperationSelector({ selectedOperation, onSelectOperation }: OperationSelectorProps) {
  return (
    <div className="operation-selector">
      <h2 className="section-title">เลือกคำสั่ง SQL</h2>
      
      {operations.map((group) => (
        <div key={group.category} className="operation-group">
          <div className="group-header">
            <group.icon size={18} />
            <span>{group.category}</span>
          </div>
          
          <div className="operation-items">
            {group.items.map((item) => (
              <button
                key={item.id}
                className={`operation-item ${selectedOperation === item.id ? 'active' : ''}`}
                onClick={() => onSelectOperation(item.id)}
                style={{
                  borderLeft: selectedOperation === item.id ? `3px solid ${item.color}` : 'none',
                }}
              >
                <span className="operation-label">{item.label}</span>
                {selectedOperation === item.id && (
                  <span className="operation-badge">เลือกอยู่</span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
