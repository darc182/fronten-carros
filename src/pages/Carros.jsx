import { useEffect, useState } from 'react';
import { getCarros, createCarro, updateCarro, deleteCarro } from '../services/api';

export default function Carros({ token }) {
  const [carros, setCarros] = useState([]);
  const [form, setForm] = useState({ marca: '', modelo: '', año: '', matricula: '', disponible: true });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ marca: '', modelo: '', año: '', matricula: '', disponible: true });

  useEffect(() => {
    if (token) {
      getCarros(token).then(data => {
        setCarros(data);
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
    const res = await createCarro(form, token);
    setCarros([...carros, res]);
    setForm({ marca: '', modelo: '', año: '', matricula: '', disponible: true });
    setShowForm(false);
  };

  const handleEdit = (carro) => {
    setEditId(carro._id);
    setEditForm({
      marca: carro.marca || '',
      modelo: carro.modelo || '',
      año: carro.año || '',
      matricula: carro.matricula || '',
      disponible: carro.disponible !== undefined ? carro.disponible : true
    });
  };

  const handleUpdate = async (id) => {
    const res = await updateCarro(id, editForm, token);
    setCarros(carros.map(c => c._id === id ? res : c));
    setEditId(null);
  };

  const handleDelete = async (id) => {
    await deleteCarro(id, token);
    setCarros(carros.filter(c => c._id !== id));
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando vehículos...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div className="mb-2 mb-md-0">
          <h2 className="mb-1">
            <i className="bi bi-car-front-fill text-primary me-2"></i>
            Gestión de Vehículos
          </h2>
          <p className="text-muted mb-0 d-none d-sm-block">Administra la flota de vehículos</p>
        </div>
        <button 
          className="btn btn-primary w-100 w-md-auto"
          onClick={() => setShowForm(!showForm)}
        >
          <i className="bi bi-car-front me-1"></i>
          {showForm ? 'Cancelar' : 'Agregar Vehículo'}
        </button>
      </div>

      {/* Formulario para agregar vehículo */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">
              <i className="bi bi-car-front me-2"></i>
              Nuevo Vehículo
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-tag me-2"></i>Marca
                  </label>
                  <input 
                    name="marca" 
                    className="form-control"
                    placeholder="Ej: Toyota, Honda, Ford" 
                    value={form.marca} 
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-car-front me-2"></i>Modelo
                  </label>
                  <input 
                    name="modelo" 
                    className="form-control"
                    placeholder="Ej: Corolla, Civic, Focus" 
                    value={form.modelo} 
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-calendar3 me-2"></i>Año
                  </label>
                  <input 
                    name="año" 
                    type="number"
                    min="1980"
                    max="2025"
                    className="form-control"
                    placeholder="Ej: 2023" 
                    value={form.año} 
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-credit-card me-2"></i>Matrícula
                  </label>
                  <input 
                    name="matricula" 
                    className="form-control"
                    placeholder="Ej: ABC-123" 
                    value={form.matricula} 
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <div className="form-check">
                  <input 
                    name="disponible" 
                    type="checkbox" 
                    className="form-check-input"
                    id="disponible"
                    checked={form.disponible} 
                    onChange={e => setForm({ ...form, disponible: e.target.checked })}
                  />
                  <label className="form-check-label" htmlFor="disponible">
                    <i className="bi bi-check-circle me-2"></i>
                    Disponible para renta
                  </label>
                </div>
              </div>
              
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  <i className="bi bi-check-lg me-1"></i>
                  Guardar Vehículo
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

      {/* Lista de vehículos */}
      <div className="row">
        {carros.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info text-center">
              <i className="bi bi-info-circle-fill me-2"></i>
              No hay vehículos registrados aún
            </div>
          </div>
        ) : (
          carros.map(c => (
            <div key={c._id} className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  {editId === c._id ? (
                    <form onSubmit={e => { e.preventDefault(); handleUpdate(c._id); }}>
                      <input name="marca" value={editForm.marca} onChange={handleEditChange} className="form-control mb-1" placeholder="Marca" />
                      <input name="modelo" value={editForm.modelo} onChange={handleEditChange} className="form-control mb-1" placeholder="Modelo" />
                      <input name="año" type="number" value={editForm.año} onChange={handleEditChange} className="form-control mb-1" placeholder="Año" />
                      <input name="matricula" value={editForm.matricula} onChange={handleEditChange} className="form-control mb-1" placeholder="Matrícula" />
                      <div className="form-check mb-2">
                        <input name="disponible" type="checkbox" className="form-check-input" id={`editDisponible${c._id}`} checked={editForm.disponible} onChange={e => setEditForm({ ...editForm, disponible: e.target.checked })} />
                        <label className="form-check-label" htmlFor={`editDisponible${c._id}`}>Disponible para renta</label>
                      </div>
                      <div className="d-flex gap-2 mt-2">
                        <button type="submit" className="btn btn-success btn-sm">Guardar</button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>Cancelar</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center flex-grow-1 min-width-0">
                          <div className={`bg-${c.disponible ? 'success' : 'danger'} rounded-circle p-2 me-3 flex-shrink-0`}>
                            <i className="bi bi-car-front-fill text-white"></i>
                          </div>
                          <div className="min-width-0 flex-grow-1">
                            <h6 className="card-title mb-0 text-truncate">{c.marca} {c.modelo}</h6>
                            <small className="text-muted">Año {c.año}</small>
                          </div>
                        </div>
                        <span className={`badge bg-${c.disponible ? 'success' : 'danger'} flex-shrink-0`}>
                          <small>{c.disponible ? 'Disponible' : 'Ocupado'}</small>
                        </span>
                      </div>
                      <div className="mb-2">
                        <i className="bi bi-credit-card text-muted me-2"></i>
                        <strong>Matrícula:</strong> {c.matricula}
                      </div>
                      <div className="mb-2">
                        <i className="bi bi-calendar3 text-muted me-2"></i>
                        <strong>Modelo:</strong> {c.año}
                      </div>
                    </>
                  )}
                </div>
                <div className="card-footer bg-light d-flex justify-content-between align-items-center">
                  <small className="text-muted text-truncate flex-grow-1 me-2">
                    <i className="bi bi-tag me-1"></i>
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
          ))
        )}
      </div>
    </div>
  );
}
