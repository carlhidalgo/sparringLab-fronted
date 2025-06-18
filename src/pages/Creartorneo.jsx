import React, { useState, useEffect, useRef } from 'react';
import './CrearTorneo.css';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { MenuItem } from '@mui/material';
import { apiFetch } from '../utils/api';

function CrearTorneo() {
    const [formData, setFormData] = useState({
        nombre: '',
        inicio: '',
        final: '',
        lugar: '',
        descripcion: '',
    });
    const [cities, setCities] = useState([]);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const titleRef = useRef();

    useEffect(() => {
        const fetchCities = async () => {
            const { data, error } = await supabase.from('Ciudad').select('*');
            if (error) {
                console.error('Error fetching cities:', error);
            } else {
                setCities(data);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        if (titleRef.current) {
            setTimeout(() => titleRef.current.classList.add('visible'), 200);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        const { nombre, inicio, final, lugar } = formData;
        if (!nombre || !inicio || !final || !lugar) {
            setError('Por favor completa todos los campos obligatorios.');
            return;
        }
        if (new Date(inicio) > new Date(final)) {
            setError('La fecha de inicio no puede ser posterior a la fecha final.');
            return;
        }
        if (!user || !user.id) {
            setError('Usuario no autenticado.');
            return;
        }
        const dataToSend = { ...formData, user_id: user.id };
        try {
            const res = await apiFetch('/api/crear-torneo/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(dataToSend),
            });
            if (res.ok) {
                setSuccessMsg('¡Torneo creado con éxito!');
                setTimeout(() => navigate('/torneos'), 1500);
            } else {
                const errData = await res.json();
                setError(errData.detail || 'Error al crear torneo.');
            }
        } catch (err) {
            setError('Error de red o del servidor.');
        }
    };

    return (
        <div className="crear-torneo-container">
            <h2 className="crear-torneo-title" ref={titleRef}>Crear Torneo</h2>
            {error && <div className="crear-torneo-error">{error}</div>}
            {successMsg && <div className="crear-torneo-success">{successMsg}</div>}
            <form className="crear-torneo-form" onSubmit={handleSubmit}>
                <label className="crear-torneo-label">Nombre del Torneo*</label>
                <input
                    className="crear-torneo-input"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
                <label className="crear-torneo-label">Fecha de Inicio*</label>
                <input
                    className="crear-torneo-input"
                    name="inicio"
                    type="date"
                    value={formData.inicio}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                />
                <label className="crear-torneo-label">Fecha Final*</label>
                <input
                    className="crear-torneo-input"
                    name="final"
                    type="date"
                    value={formData.final}
                    onChange={handleChange}
                    min={formData.inicio || new Date().toISOString().split('T')[0]}
                    required
                />
                <label className="crear-torneo-label">Ciudad*</label>
                <select
                    className="crear-torneo-select"
                    name="lugar"
                    value={formData.lugar}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selecciona una ciudad</option>
                    {cities.map((city) => (
                        <option key={city.id} value={city.id}>{city.nombre}</option>
                    ))}
                </select>
                <label className="crear-torneo-label">Descripción</label>
                <textarea
                    className="crear-torneo-input"
                    name="descripcion"
                    rows={4}
                    value={formData.descripcion}
                    onChange={handleChange}
                />
                <button className="crear-torneo-btn" type="submit">Crear</button>
            </form>
        </div>
    );
}

export default CrearTorneo;