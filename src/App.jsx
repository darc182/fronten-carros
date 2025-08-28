
import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Clientes from './pages/Clientes';
import Carros from './pages/Carros';
import Rentas from './pages/Rentas';

export default function App() {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [page, setPage] = useState('login');

  if (!token) {
    return (
      <div className="d-flex flex-column min-vh-100">
        {/* Navbar para páginas de autenticación */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              <i className="bi bi-car-front-fill me-2"></i>
              RentaCars
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <div className="navbar-nav ms-auto">
                <button 
                  className={`btn ${page === 'login' ? 'btn-light' : 'btn-outline-light'} me-2 mb-2 mb-lg-0`}
                  onClick={() => setPage('login')}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Iniciar Sesión
                </button>
                <button 
                  className={`btn ${page === 'register' ? 'btn-light' : 'btn-outline-light'}`}
                  onClick={() => setPage('register')}
                >
                  <i className="bi bi-person-plus me-1"></i>
                  Registrarse
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex-grow-1 d-flex align-items-center py-4">
          <div className="container">
            {page === 'login' && <Login setToken={setToken} setUserId={setUserId} />}
            {page === 'register' && <Register />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar principal */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <i className="bi bi-car-front-fill me-2"></i>
            <span className="d-none d-sm-inline">RentaCars - Panel</span>
            <span className="d-inline d-sm-none">RentaCars</span>
          </a>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav ms-auto">
              <button 
                className={`btn ${page === 'clientes' ? 'btn-light' : 'btn-outline-light'} me-2 mb-2 mb-lg-0`}
                onClick={() => setPage('clientes')}
              >
                <i className="bi bi-people me-1"></i>
                <span className="d-none d-md-inline">Clientes</span>
                <span className="d-inline d-md-none">Clientes</span>
              </button>
              <button 
                className={`btn ${page === 'carros' ? 'btn-light' : 'btn-outline-light'} me-2 mb-2 mb-lg-0`}
                onClick={() => setPage('carros')}
              >
                <i className="bi bi-car-front me-1"></i>
                <span className="d-none d-md-inline">Carros</span>
                <span className="d-inline d-md-none">Carros</span>
              </button>
              <button 
                className={`btn ${page === 'rentas' ? 'btn-light' : 'btn-outline-light'} me-2 mb-2 mb-lg-0`}
                onClick={() => setPage('rentas')}
              >
                <i className="bi bi-calendar-check me-1"></i>
                <span className="d-none d-md-inline">Rentas</span>
                <span className="d-inline d-md-none">Rentas</span>
              </button>
              <button 
                className="btn btn-outline-light"
                onClick={() => { setToken(''); setUserId(''); setPage('login'); }}
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                <span className="d-none d-sm-inline">Cerrar Sesión</span>
                <span className="d-inline d-sm-none">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow-1">
        <div className="container-fluid py-3">
          <div className="container">
            {page === 'clientes' && <Clientes token={token} />}
            {page === 'carros' && <Carros token={token} />}
            {page === 'rentas' && <Rentas token={token} userId={userId} />}
          </div>
        </div>
      </div>
    </div>
  );
}
