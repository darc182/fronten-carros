import { useState } from 'react';
import { register } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', rol: 'cliente' });
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    
    const res = await register(form);
    setMsg(res.message || 'Usuario registrado exitosamente');
    setMsgType(res.error ? 'danger' : 'success');
    
    if (!res.error) {
      setForm({ username: '', password: '', rol: 'cliente' });
    }
    
    setLoading(false);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-sm-8 col-md-6 col-lg-4">
        <div className="card shadow border-0">
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <i className="bi bi-person-plus-fill text-success" style={{fontSize: '3rem'}}></i>
              <h2 className="card-title mt-2 mb-0">Crear Cuenta</h2>
              <p className="text-muted">Únete a nuestro sistema</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  <i className="bi bi-person me-2"></i>Usuario
                </label>
                <input 
                  name="username" 
                  type="text"
                  className="form-control form-control-lg"
                  id="username"
                  placeholder="Elige un nombre de usuario" 
                  value={form.username} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  <i className="bi bi-lock me-2"></i>Contraseña
                </label>
                <input 
                  name="password" 
                  type="password" 
                  className="form-control form-control-lg"
                  id="password"
                  placeholder="Crea una contraseña segura" 
                  value={form.password} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="rol" className="form-label">
                  <i className="bi bi-shield-check me-2"></i>Rol
                </label>
                <select 
                  name="rol" 
                  className="form-select form-select-lg"
                  id="rol"
                  value={form.rol} 
                  onChange={handleChange}
                  required
                >
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-success btn-lg w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Registrando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus me-2"></i>
                    Registrarse
                  </>
                )}
              </button>
              
              {msg && (
                <div className={`alert alert-${msgType} mt-3 d-flex align-items-center`}>
                  <i className={`bi ${msgType === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
                  {msg}
                </div>
              )}
            </form>
          </div>
        </div>
        
        <div className="text-center mt-3">
          <small className="text-muted">
            Al registrarte aceptas nuestros términos y condiciones
          </small>
        </div>
      </div>
    </div>
  );
}
