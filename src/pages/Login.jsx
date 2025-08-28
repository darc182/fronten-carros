import { useState } from 'react';
import { login } from '../services/api';

export default function Login({ setToken, setUserId }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const res = await login(username, password);
    if (res.token) {
      setToken(res.token);
      setUserId(res.userId || '');
      setError('');
    } else {
      setError(res.message || 'Credenciales incorrectas');
    }
    setLoading(false);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-sm-8 col-md-6 col-lg-4">
        <div className="card shadow border-0">
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <i className="bi bi-car-front-fill text-primary" style={{fontSize: '3rem'}}></i>
              <h2 className="card-title mt-2 mb-0">Iniciar Sesión</h2>
              <p className="text-muted">Accede a tu cuenta</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  <i className="bi bi-person me-2"></i>Usuario
                </label>
                <input 
                  type="text" 
                  className="form-control form-control-lg"
                  id="username"
                  placeholder="Ingresa tu usuario" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  <i className="bi bi-lock me-2"></i>Contraseña
                </label>
                <input 
                  type="password" 
                  className="form-control form-control-lg"
                  id="password"
                  placeholder="Ingresa tu contraseña" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Entrando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Entrar
                  </>
                )}
              </button>
              
              {error && (
                <div className="alert alert-danger mt-3 d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
        
        <div className="text-center mt-3">
          <small className="text-muted">
            Sistema de Gestión de Renta de Carros
          </small>
        </div>
      </div>
    </div>
  );
}
