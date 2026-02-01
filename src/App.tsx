import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { Home, Plus, Bug } from 'lucide-react';
import OperationSelector from './components/OperationSelector';
import SQLPreview from './components/SQLPreview';
import CommandHistory from './components/CommandHistory';
import ProfessionalFeatureRequest from './components/ProfessionalFeatureRequest';
import SelectForm from './components/forms/SelectForm';
import InsertForm from './components/forms/InsertForm';
import UpdateForm from './components/forms/UpdateForm';
import DeleteForm from './components/forms/DeleteForm';
import CreateTableForm from './components/forms/CreateTableForm';
import AlterTableForm from './components/forms/AlterTableForm';
import { generateSQL, validateSQL } from './utils/sqlGenerator';
import type { SQLOperation, CommandHistory as CommandHistoryType } from './types';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<SQLGenerator />} />
          <Route path="/feature-request" element={<FeatureRequestPage />} />
          <Route path="/bug-report" element={<BugReportPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function SQLGenerator() {
  const [selectedOperation, setSelectedOperation] = useState<SQLOperation | null>(null);
  const [generatedSQL, setGeneratedSQL] = useState<string>('');
  const [history, setHistory] = useState<CommandHistoryType[]>([]);

  const handleGenerate = (sql: string) => {
    setGeneratedSQL(sql);
    addToHistory(sql);
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleClearAllHistory = () => {
    if (window.confirm('ต้องการลบประวัติคำสั่งทั้งหมดหรือไม่?')) {
      setHistory([]);
    }
  };

  const addToHistory = (command: string) => {
    if (history.length > 0) {
      const lastCommand = history[history.length - 1].command;
      if (lastCommand === command) {
        return;
      }
    }

    const newHistory: CommandHistoryType = {
      id: Date.now().toString(),
      timestamp: new Date(),
      command,
      type: selectedOperation || 'SELECT',
    };
    setHistory(prev => [...prev, newHistory]);
  };

  const renderForm = () => {
    switch (selectedOperation) {
      case 'SELECT':
        return <SelectForm onGenerate={(state) => handleGenerate(generateSQL.select(state))} />;
      
      case 'INSERT':
        return <InsertForm onGenerate={(state) => handleGenerate(generateSQL.insert(state))} />;
      
      case 'UPDATE':
        return <UpdateForm onGenerate={(state) => handleGenerate(generateSQL.update(state))} />;
      
      case 'DELETE':
        return <DeleteForm onGenerate={(state) => handleGenerate(generateSQL.delete(state))} />;
      
      case 'CREATE_TABLE':
        return <CreateTableForm onGenerate={(state) => handleGenerate(generateSQL.createTable(state))} />;
      
      case 'ALTER_TABLE':
        return <AlterTableForm onGenerate={(state) => handleGenerate(generateSQL.alterTable(state))} />;
      
      case 'DROP_TABLE':
        return (
          <form className="sql-form" onSubmit={(e) => {
            e.preventDefault();
            const tableName = (e.currentTarget.elements.namedItem('tableName') as HTMLInputElement).value;
            handleGenerate(generateSQL.dropTable(tableName));
          }}>
            <h3 className="form-title">DROP TABLE - ลบตาราง</h3>
            <div className="form-group">
              <label>ชื่อ Table *</label>
              <input type="text" name="tableName" placeholder="users" required />
            </div>
            <div className="form-warning">⚠️ คำสั่งนี้จะลบ Table และข้อมูลทั้งหมด!</div>
            <button type="submit" className="btn-danger">Generate SQL</button>
          </form>
        );
      
      case 'CREATE_DATABASE':
        return (
          <form className="sql-form" onSubmit={(e) => {
            e.preventDefault();
            const dbName = (e.currentTarget.elements.namedItem('dbName') as HTMLInputElement).value;
            handleGenerate(generateSQL.createDatabase(dbName));
          }}>
            <h3 className="form-title">CREATE DATABASE - สร้างฐานข้อมูล</h3>
            <div className="form-group">
              <label>ชื่อ Database *</label>
              <input type="text" name="dbName" placeholder="my_database" required />
            </div>
            <button type="submit" className="btn-primary">Generate SQL</button>
          </form>
        );
      
      case 'DROP_DATABASE':
        return (
          <form className="sql-form" onSubmit={(e) => {
            e.preventDefault();
            const dbName = (e.currentTarget.elements.namedItem('dbName') as HTMLInputElement).value;
            handleGenerate(generateSQL.dropDatabase(dbName));
          }}>
            <h3 className="form-title">DROP DATABASE - ลบฐานข้อมูล</h3>
            <div className="form-group">
              <label>ชื่อ Database *</label>
              <input type="text" name="dbName" placeholder="my_database" required />
            </div>
            <div className="form-warning">⚠️ คำสั่งนี้จะลบ Database และข้อมูลทั้งหมด!</div>
            <button type="submit" className="btn-danger">Generate SQL</button>
          </form>
        );
      
      default:
        return (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="60" r="58" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.3"/>
                <path d="M40 45H80M40 60H80M40 75H65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
                <circle cx="85" cy="35" r="8" fill="#3b82f6" opacity="0.8"/>
                <path d="M82 35L84 37L89 32" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="35" cy="85" r="6" fill="#10b981" opacity="0.6"/>
                <path d="M33 85L35 87L38 82" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="85" cy="85" r="5" fill="#f59e0b" opacity="0.5"/>
                <path d="M83 85L85 87L87 83" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="empty-state-title">ยังไม่ได้เลือกคำสั่ง</h3>
            <p className="empty-state-description">เลือกคำสั่ง SQL จากด้านซ้ายเพื่อเริ่มสร้างคำสั่งของคุณ</p>
          </div>
        );
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-main">
            <h1>MySQL Shell Command Generator</h1>
            <p>สร้างคำสั่ง SQL สำหรับ mysqlsh ได้ง่ายๆ</p>
          </div>
          <nav className="header-nav">
            <Link to="/" className="nav-link active">
              <Home size={14} />
              <span>Generator</span>
            </Link>
            <Link to="/feature-request" className="nav-link">
              <Plus size={14} />
              <span>เสนอคำสั่ง</span>
            </Link>
            <Link to="/bug-report" className="nav-link">
              <Bug size={14} />
              <span>แจ้งบั๊ก</span>
            </Link>
          </nav>
        </div>
      </header>
      
      <div className="app-layout">
        <aside className="sidebar">
          <OperationSelector
            selectedOperation={selectedOperation}
            onSelectOperation={setSelectedOperation}
          />
        </aside>

        <main className={`main-content ${generatedSQL ? 'has-content' : ''}`}>
          <div className="form-container">
            {renderForm()}
          </div>

          {generatedSQL && (
            <div className="preview-container">
              <SQLPreview
                command={generatedSQL}
                isDangerous={validateSQL.isDangerousOperation(generatedSQL)}
                isFullTable={validateSQL.isFullTableOperation(generatedSQL)}
              />
            </div>
          )}
        </main>

        <aside className="history-sidebar">
          <CommandHistory
            history={history}
            onSelectCommand={(cmd) => setGeneratedSQL(cmd)}
            onDeleteCommand={handleDeleteHistory}
            onClearAll={handleClearAllHistory}
          />
        </aside>
      </div>
    </div>
  );
}

function FeatureRequestPage() {
  return <ProfessionalFeatureRequest type="feature" />;
}

function BugReportPage() {
  return <ProfessionalFeatureRequest type="bug" />;
}

export default App;
