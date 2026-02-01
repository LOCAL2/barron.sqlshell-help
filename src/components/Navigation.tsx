import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, Bug } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="app-nav">
      <Link 
        to="/" 
        className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
      >
        <Home size={18} />
        <span>SQL Generator</span>
      </Link>
      
      <Link 
        to="/feature-request" 
        className={`nav-item ${location.pathname === '/feature-request' ? 'active' : ''}`}
      >
        <Plus size={18} />
        <span>เสนอคำสั่งใหม่</span>
      </Link>
      
      <Link 
        to="/bug-report" 
        className={`nav-item ${location.pathname === '/bug-report' ? 'active' : ''}`}
      >
        <Bug size={18} />
        <span>แจ้งบั๊ก</span>
      </Link>
    </nav>
  );
}
