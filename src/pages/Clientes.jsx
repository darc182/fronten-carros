import { useEffect, useState } from 'react';
import { getClientes, createCliente } from '../services/api';

export default function Clientes({ token }) {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', licenciaConducir: '', telefono: '' });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (token) {
      getClientes(token).then(data => {
        setClientes(data);
        setLoading(false);
      });
    }
  }, [token]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await createCliente(form, token);
    setClientes([...clientes, res]);
    setForm({ nombre: '', apellido: '', email: '', licenciaConducir: '', telefono: '' });
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando clientes...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div className="mb-2 mb-md-0">
          <h2 className="mb-1">
            <i className="bi bi-people-fill text-primary me-2"></i>
            Gestión de Clientes
          </h2>
          <p className="text-muted mb-0 d-none d-sm-block">Administra la información de los clientes</p>
        </div>
        <button 
          className="btn btn-primary w-100 w-md-auto"
          onClick={() => setShowForm(!showForm)}
        >
          <i className="bi bi-person-plus me-1"></i>
          {showForm ? 'Cancelar' : 'Agregar Cliente'}
        </button>
      </div>

      {/* Formulario para agregar cliente */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">
              <i className="bi bi-person-plus me-2"></i>
              Nuevo Cliente
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-person me-2"></i>Nombre
                  </label>
                  <input 
                    name="nombre" 
                    className="form-control"
                    placeholder="Nombre del cliente" 
                    value={form.nombre} 
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-person me-2"></i>Apellido
                  </label>
                  <input 
                    name="apellido" 
                    className="form-control"
                    placeholder="Apellido del cliente" 
                    value={form.apellido} 
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-envelope me-2"></i>Email
                  </label>
                  <input 
                    name="email" 
                    type="email"
                    className="form-control"
                    placeholder="correo@ejemplo.com" 
                    value={form.email} 
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-telephone me-2"></i>Teléfono
                  </label>
                  <input 
                    name="telefono" 
                    className="form-control"
                    placeholder="Número de teléfono" 
                    value={form.telefono} 
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">
                  <i className="bi bi-card-text me-2"></i>Licencia de Conducir
                </label>
                <input 
                  name="licenciaConducir" 
                  className="form-control"
                  placeholder="Número de licencia" 
                  value={form.licenciaConducir} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  <i className="bi bi-check-lg me-1"></i>
                  Guardar Cliente
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  <i className="bi bi-x-lg me-1"></i>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de clientes */}
      <div className="row">
        {clientes.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info text-center">
              <i className="bi bi-info-circle-fill me-2"></i>
              No hay clientes registrados aún
            </div>
          </div>
        ) : (
          clientes.map(c => (
            <div key={c._id} className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary rounded-circle p-2 me-3 flex-shrink-0">
                      <i className="bi bi-person-fill text-white"></i>
                    </div>
                    <div className="flex-grow-1 min-width-0">
                      <h6 className="card-title mb-0 text-truncate">{c.nombre} {c.apellido}</h6>
                      <small className="text-muted">Cliente</small>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <i className="bi bi-envelope text-muted me-2"></i>
                    <small className="text-truncate d-inline-block" style={{maxWidth: '180px'}}>{c.email}</small>
                  </div>
                  
                  {c.telefono && (
                    <div className="mb-2">
                      <i className="bi bi-telephone text-muted me-2"></i>
                      <small>{c.telefono}</small>
                    </div>
                  )}
                  
                  {c.licenciaConducir && (
                    <div className="mb-2">
                      <i className="bi bi-card-text text-muted me-2"></i>
                      <small className="text-truncate d-inline-block" style={{maxWidth: '180px'}}>Lic: {c.licenciaConducir}</small>
                    </div>
                  )}
                </div>
                
                <div className="card-footer bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted text-truncate flex-grow-1 me-2">
                      <i className="bi bi-calendar3 me-1"></i>
                      ID: {c._id ? c._id.slice(-6) : 'Sin ID'}
                    </small>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-primary btn-sm" title="Ver detalles">
                        <i className="bi bi-eye"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
