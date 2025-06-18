import React, { useEffect, useState } from 'react';
import { addHours, format, parseISO, differenceInHours } from 'date-fns';
import supabase from '../connection/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Arriendo.css';

const Arriendo = () => {
  const { user } = useAuth();
  const [implementoSeleccionado, setImplementoSeleccionado] = useState('');
  const [implementos, setImplementos] = useState([]);
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [cantidadHoras, setCantidadHoras] = useState(1);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchImplementos = async () => {
      const { data, error } = await supabase.from('implementos').select('*');
      if (error) {
        console.error('Error al obtener implementos:', error.message);
        setError('Error al obtener implementos');
      } else {
        setImplementos(data);
      }
    };

    fetchImplementos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!implementoSeleccionado || !fecha || !horaInicio || !cantidadHoras) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const horaFin = new Date(`${fecha}T${horaInicio}`);
    horaFin.setHours(horaFin.getHours() + cantidadHoras);

    const reservasConflicto = await supabase
      .from('reservas')
      .select('*')
      .eq('fecha', fecha)
      .eq('implemento_id', implementoSeleccionado)
      .or(`hora_inicio.lte.${horaFin.toISOString()},hora_fin.gte.${horaInicio}`);

    if (reservasConflicto.data.length > 0) {
      setError('El implemento ya está reservado en ese horario');
      return;
    }

    const { data, error: reservaError } = await supabase
      .from('reservas')
      .insert([
        {
          user_id: user.id,
          implemento_id: implementoSeleccionado,
          fecha,
          hora_inicio: horaInicio,
          hora_fin: horaFin.toISOString(),
          cantidad_horas: cantidadHoras,
        },
      ]);

    if (reservaError) {
      setError('Error al guardar la reserva');
      console.error('Error al guardar la reserva:', reservaError.message);
    } else {
      setSuccessMessage('Reserva realizada con éxito');
      setImplementoSeleccionado('');
      setFecha('');
      setHoraInicio('');
      setCantidadHoras(1);
    }
  };

  return (
    <div className="arriendo-container">
      <h2 className="arriendo-header">Arriendo de Implementos de Boxeo</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="arriendo-form">
        <div className="form-group">
          <label htmlFor="implemento" className="form-label">Implemento:</label>
          <select
            id="implemento"
            value={implementoSeleccionado}
            onChange={(e) => setImplementoSeleccionado(e.target.value)}
            required
            className="form-control"
          >
            <option value="">Selecciona un implemento</option>
            {implementos.map((imp) => (
              <option key={imp.id} value={imp.id}>
                {imp.nombre} - {imp.descripcion}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="fecha" className="form-label">Fecha:</label>
          <input
            type="date"
            id="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="horaInicio" className="form-label">Hora de Inicio:</label>
          <input
            type="time"
            id="horaInicio"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="cantidadHoras" className="form-label">Cantidad de Horas:</label>
          <input
            type="number"
            id="cantidadHoras"
            value={cantidadHoras}
            onChange={(e) => setCantidadHoras(parseInt(e.target.value, 10))}
            min="1"
            required
            className="form-control"
            placeholder="Número de horas"
          />
        </div>
        <button type="submit" className="arriendo-button">Confirmar Arriendo</button>
      </form>

      <Link to="/calendario" className="btn btn-secondary w-100 mt-3">
        Ver Calendario de Reservas
      </Link>
    </div>
  );
};

export default Arriendo;



