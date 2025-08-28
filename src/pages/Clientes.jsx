import { useEffect, useState } from 'react';
import { getClientes, createCliente, updateCliente, deleteCliente } from '../services/api';

export default function Clientes({ token }) {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', licenciaConducir: '', telefono: '' });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: '', apellido: '', email: '', licenciaConducir: '', telefono: '' });

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

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await createCliente(form, token);
    setClientes([...clientes, res]);
    setForm({ nombre: '', apellido: '', email: '', licenciaConducir: '', telefono: '' });
    setShowForm(false);
  };

  const handleEdit = (cliente) => {
    setEditId(cliente._id);
    setEditForm({
      nombre: cliente.nombre || '',
      apellido: cliente.apellido || '',
      email: cliente.email || '',
      licenciaConducir: cliente.licenciaConducir || '',
      telefono: cliente.telefono || ''
    });
  };

  const handleUpdate = async (id) => {
    const res = await updateCliente(id, editForm, token);
    setClientes(clientes.map(c => c._id === id ? res : c));
    setEditId(null);
  };

  const handleDelete = async (id) => {
    await deleteCliente(id, token);
    setClientes(clientes.filter(c => c._id !== id));
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
                  
                  {editId === c._id ? (
                    <form onSubmit={e => { e.preventDefault(); handleUpdate(c._id); }}>
                      <input name="nombre" value={editForm.nombre} onChange={handleEditChange} className="form-control mb-1" placeholder="Nombre" />
                      <input name="apellido" value={editForm.apellido} onChange={handleEditChange} className="form-control mb-1" placeholder="Apellido" />
                      <input name="email" value={editForm.email} onChange={handleEditChange} className="form-control mb-1" placeholder="Email" />
                      <input name="telefono" value={editForm.telefono} onChange={handleEditChange} className="form-control mb-1" placeholder="Teléfono" />
                      <input name="licenciaConducir" value={editForm.licenciaConducir} onChange={handleEditChange} className="form-control mb-1" placeholder="Licencia" />
                      <div className="d-flex gap-2 mt-2">
                        <button type="submit" className="btn btn-success btn-sm">Guardar</button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>Cancelar</button>
                      </div>
                    </form>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
                
                <div className="card-footer bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted text-truncate flex-grow-1 me-2">
                      <i className="bi bi-calendar3 me-1"></i>
                      ID: {c._id ? c._id.slice(-6) : 'Sin ID'}
                    </small>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-primary btn-sm" title="Editar" onClick={() => handleEdit(c)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-outline-danger btn-sm" title="Eliminar" onClick={() => handleDelete(c._id)}>
                        <i className="bi bi-trash"></i>
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
