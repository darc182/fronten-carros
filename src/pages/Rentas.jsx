import { useEffect, useState } from 'react';
import { getRentas, createRenta, updateRenta, deleteRenta, getClientes, getCarros } from '../services/api';

export default function Rentas({ token, userId }) {
  const [rentas, setRentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carros, setCarros] = useState([]);
  const [form, setForm] = useState({ clienteId: userId || '', carroId: '', fechaInicio: '', fechaFin: '', costo: '' });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ clienteId: '', carroId: '', fechaInicio: '', fechaFin: '', costo: '' });

  useEffect(() => {
    if (token) {
      getRentas(token)
        .then(data => {
          const rentasValidas = Array.isArray(data) ? data.filter(r => r && r._id) : [];
          setRentas(rentasValidas);
          setLoading(false);
        })
        .catch(error => {
          setRentas([]);
          setLoading(false);
        });
      getClientes(token)
        .then(data => {
          setClientes(Array.isArray(data) ? data : []);
        })
        .catch(() => setClientes([]));
      getCarros(token)
        .then(data => {
          setCarros(Array.isArray(data) ? data : []);
        })
        .catch(() => setCarros([]));
    }
  }, [token]);

  useEffect(() => {
    setForm(f => ({ ...f, clienteId: userId || '' }));
  }, [userId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await createRenta(form, token);
      if (res && res._id) {
        setRentas([...rentas, res]);
        setForm({ clienteId: userId || '', carroId: '', fechaInicio: '', fechaFin: '', costo: '' });
        setShowForm(false);
      } else {
        alert('Error al crear la renta.');
      }
    } catch (error) {
      alert('Error al crear la renta.');
    }
  };

  const handleEdit = (renta) => {
    setEditId(renta._id);
    setEditForm({
      clienteId: typeof renta.clienteId === 'object' ? renta.clienteId._id : renta.clienteId,
      carroId: typeof renta.carroId === 'object' ? renta.carroId._id : renta.carroId,
      fechaInicio: renta.fechaInicio ? renta.fechaInicio.slice(0,10) : '',
      fechaFin: renta.fechaFin ? renta.fechaFin.slice(0,10) : '',
      costo: renta.costo || ''
    });
  };

  const handleUpdate = async (id) => {
    const res = await updateRenta(id, editForm, token);
    setRentas(rentas.map(r => r._id === id ? res : r));
    setEditId(null);
  };

  const handleDelete = async (id) => {
    await deleteRenta(id, token);
    setRentas(rentas.filter(r => r._id !== id));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando rentas...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div className="mb-2 mb-md-0">
          <h2 className="mb-1">
            <i className="bi bi-calendar-check-fill text-primary me-2"></i>
            Gestión de Rentas
          </h2>
          <p className="text-muted mb-0 d-none d-sm-block">Administra las rentas de vehículos</p>
        </div>
        <button 
          className="btn btn-primary w-100 w-md-auto"
          onClick={() => setShowForm(!showForm)}
        >
          <i className="bi bi-plus-circle me-1"></i>
          {showForm ? 'Cancelar' : 'Nueva Renta'}
        </button>
      </div>

      {/* Formulario para nueva renta */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">
              <i className="bi bi-calendar-plus me-2"></i>
              Nueva Renta
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-person me-2"></i>Cliente
                  </label>
                  <select name="clienteId" className="form-control" value={form.clienteId} onChange={handleChange} required>
                    <option value="">Selecciona un cliente</option>
                    {clientes.map(c => (
                      <option key={c._id} value={c._id}>{c.nombre} {c.apellido}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-car-front me-2"></i>Vehículo
                  </label>
                  <select name="carroId" className="form-control" value={form.carroId} onChange={handleChange} required>
                    <option value="">Selecciona un vehículo</option>
                    {carros.map(car => (
                      <option key={car._id} value={car._id}>{car.modelo} (ID: {car._id.slice(-6)})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-calendar-event me-2"></i>Fecha de Inicio
                  </label>
                  <input name="fechaInicio" type="date" className="form-control" value={form.fechaInicio} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-calendar-x me-2"></i>Fecha de Fin
                  </label>
                  <input name="fechaFin" type="date" className="form-control" value={form.fechaFin} onChange={handleChange} required />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-currency-dollar me-2"></i>Costo
                  </label>
                  <input name="costo" type="number" min="0" step="0.01" className="form-control" placeholder="0.00" value={form.costo} onChange={handleChange} required />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  <i className="bi bi-check-lg me-1"></i>
                  Crear Renta
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  <i className="bi bi-x-lg me-1"></i>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de rentas */}
      <div className="row">
        {rentas.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info text-center">
              <i className="bi bi-info-circle-fill me-2"></i>
              No hay rentas registradas aún
            </div>
          </div>
        ) : (
          rentas.map(r => (
            <div key={r._id} className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-3">
              <div className="card h-100 shadow-sm">
                {editId === r._id ? (
                  <form onSubmit={e => { e.preventDefault(); handleUpdate(r._id); }} className="card-body">
                    <select name="clienteId" value={editForm.clienteId} onChange={handleEditChange} className="form-control mb-1" required>
                      <option value="">Selecciona un cliente</option>
                      {clientes.map(c => (
                        <option key={c._id} value={c._id}>{c.nombre} {c.apellido}</option>
                      ))}
                    </select>
                    <select name="carroId" value={editForm.carroId} onChange={handleEditChange} className="form-control mb-1" required>
                      <option value="">Selecciona un vehículo</option>
                      {carros.map(car => (
                        <option key={car._id} value={car._id}>{car.modelo}</option>
                      ))}
                    </select>
                    <input name="fechaInicio" type="date" value={editForm.fechaInicio} onChange={handleEditChange} className="form-control mb-1" required />
                    <input name="fechaFin" type="date" value={editForm.fechaFin} onChange={handleEditChange} className="form-control mb-1" required />
                    <input name="costo" type="number" value={editForm.costo} onChange={handleEditChange} className="form-control mb-1" placeholder="Costo" required />
                    <div className="d-flex gap-2 mt-2">
                      <button type="submit" className="btn btn-success btn-sm">Guardar</button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>Cancelar</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="card-header bg-primary text-white">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 text-truncate flex-grow-1 me-2">
                          <i className="bi bi-calendar-check me-2"></i>
                          Renta #{r._id ? r._id.slice(-6) : 'Sin ID'}
                        </h6>
                        <span className="badge bg-light text-dark flex-shrink-0">
                          <small>${r.costo}</small>
                        </span>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <i className="bi bi-person text-muted me-2"></i>
                        <strong>Cliente:</strong> {
                          typeof r.clienteId === 'object' && r.clienteId 
                            ? (r.clienteId._id ? r.clienteId._id.slice(-6) : 'Sin ID')
                            : (r.clienteId ? r.clienteId.slice(-6) : 'Sin ID')
                        }
                      </div>
                      
                      <div className="mb-2">
                        <i className="bi bi-car-front text-muted me-2"></i>
                        <strong>Vehículo:</strong> {
                          typeof r.carroId === 'object' && r.carroId 
                            ? (r.carroId._id ? r.carroId._id.slice(-6) : 'Sin ID')
                            : (r.carroId ? r.carroId.slice(-6) : 'Sin ID')
                        }
                      </div>
                      
                      <hr />
                      
                      <div className="mb-2">
                        <i className="bi bi-calendar-event text-success me-2"></i>
                        <strong>Inicio:</strong> {formatDate(r.fechaInicio)}
                      </div>
                      
                      <div className="mb-2">
                        <i className="bi bi-calendar-x text-danger me-2"></i>
                        <strong>Fin:</strong> {formatDate(r.fechaFin)}
                      </div>
                      
                      <div className="mb-2">
                        <i className="bi bi-clock text-info me-2"></i>
                        <strong>Duración:</strong> {calculateDays(r.fechaInicio, r.fechaFin)} días
                      </div>
                    </div>
                  </>
                )}
                <div className="card-footer bg-light d-flex justify-content-between align-items-center">
                  <small className="text-muted text-truncate flex-grow-1 me-2">
                    <i className="bi bi-tag me-1"></i>
                    {new Date(r.fechaInicio).toLocaleDateString()}
                  </small>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-primary btn-sm" title="Editar" onClick={() => handleEdit(r)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn btn-outline-danger btn-sm" title="Eliminar" onClick={() => handleDelete(r._id)}>
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
