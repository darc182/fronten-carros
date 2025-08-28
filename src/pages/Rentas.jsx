import { useEffect, useState } from 'react';
import { getRentas, createRenta } from '../services/api';

export default function Rentas({ token, userId }) {
  const [rentas, setRentas] = useState([]);
  const [form, setForm] = useState({ clienteId: userId || '', carroId: '', fechaInicio: '', fechaFin: '', costo: '' });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (token) {
      getRentas(token).then(data => {
        setRentas(data);
        setLoading(false);
      });
    }
  }, [token]);

  useEffect(() => {
    setForm(f => ({ ...f, clienteId: userId || '' }));
  }, [userId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await createRenta(form, token);
    setRentas([...rentas, res]);
    setForm({ clienteId: userId || '', carroId: '', fechaInicio: '', fechaFin: '', costo: '' });
    setShowForm(false);
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
                    <i className="bi bi-car-front me-2"></i>ID del Vehículo
                  </label>
                  <input 
                    name="carroId" 
                    className="form-control"
                    placeholder="Ingresa el ID del vehículo" 
                    value={form.carroId} 
                    onChange={handleChange}
                    required
                  />
                  <small className="form-text text-muted">
                    Puedes encontrar el ID en la sección de vehículos
                  </small>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-currency-dollar me-2"></i>Costo
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input 
                      name="costo" 
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-control"
                      placeholder="0.00" 
                      value={form.costo} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-calendar-event me-2"></i>Fecha de Inicio
                  </label>
                  <input 
                    name="fechaInicio" 
                    type="date" 
                    className="form-control"
                    value={form.fechaInicio} 
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="bi bi-calendar-x me-2"></i>Fecha de Fin
                  </label>
                  <input 
                    name="fechaFin" 
                    type="date" 
                    className="form-control"
                    value={form.fechaFin} 
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  <i className="bi bi-check-lg me-1"></i>
                  Crear Renta
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
                <div className="card-header bg-primary text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 text-truncate flex-grow-1 me-2">
                      <i className="bi bi-calendar-check me-2"></i>
                      Renta #{r._id.slice(-6)}
                    </h6>
                    <span className="badge bg-light text-dark flex-shrink-0">
                      <small>${r.costo}</small>
                    </span>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="mb-2">
                    <i className="bi bi-person text-muted me-2"></i>
                    <strong>Cliente:</strong> {typeof r.clienteId === 'object' ? r.clienteId._id?.slice(-6) || 'Sin ID' : r.clienteId.slice(-6)}
                  </div>
                  
                  <div className="mb-2">
                    <i className="bi bi-car-front text-muted me-2"></i>
                    <strong>Vehículo:</strong> {typeof r.carroId === 'object' ? r.carroId._id?.slice(-6) || 'Sin ID' : r.carroId.slice(-6)}
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
                
                <div className="card-footer bg-light d-flex justify-content-between align-items-center">
                  <small className="text-muted text-truncate flex-grow-1 me-2">
                    <i className="bi bi-tag me-1"></i>
                    {new Date(r.fechaInicio).toLocaleDateString()}
                  </small>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-primary btn-sm" title="Ver detalles">
                      <i className="bi bi-eye"></i>
                    </button>
                    <button className="btn btn-outline-secondary btn-sm" title="Editar">
                      <i className="bi bi-pencil"></i>
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
