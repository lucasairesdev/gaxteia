import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Reports } from './pages/Reports';
import './styles/Navbar.css';

function Navbar() {
  const location = useLocation();
  return (
    <nav className="navbar">
      <div className="navbar-brand">GaxteIA</div>
      <div className="navbar-links">
        <Link to="/" className={`nav-btn${location.pathname === '/' ? ' active' : ''}`}>Registrar Gasto</Link>
        <Link to="/reports" className={`nav-btn${location.pathname === '/reports' ? ' active' : ''}`}>Relatórios</Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
