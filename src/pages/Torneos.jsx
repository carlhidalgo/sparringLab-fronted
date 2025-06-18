import React, { useEffect, useState, useRef } from 'react';
import './Torneos.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

function Torneos() {
  const [tournaments, setTournaments] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();
  const titleRef = useRef();
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await apiFetch('/api/torneo/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTournaments(data);
        } else {
          console.error('Error fetching tournaments:', data.detail || data.error);
        }
      } catch (err) {
        console.error('Network error:', err);
      }
    };
    fetchTournaments();
  }, [token]);

  // Animación de aparición para el título y tarjetas
  useEffect(() => {
    const handleScroll = () => {
      if (titleRef.current) {
        const rect = titleRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
          titleRef.current.classList.add('visible');
        }
      }
      // Tarjetas
      const cards = document.querySelectorAll('.torneo-card');
      cards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
          setVisibleCards((prev) => {
            if (!prev.includes(idx)) return [...prev, idx];
            return prev;
          });
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tournaments]);

  const filteredTournaments = tournaments.filter((t) =>
    t.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="torneos-container">
      <div className="torneos-header">
        <h2 className="torneos-title" ref={titleRef}>Torneos</h2>
        <button className="torneos-crear-btn" onClick={() => navigate('/Creartorneo')}>
          Crear Torneo
        </button>
      </div>
      <input
        className="torneos-search"
        type="text"
        placeholder="Buscar torneo"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="torneos-grid">
        {filteredTournaments.length > 0 ? (
          filteredTournaments.map((tournament, idx) => (
            <div
              className={`torneo-card${visibleCards.includes(idx) ? ' visible' : ''}`}
              key={tournament.id}
              style={{ animationDelay: `${0.1 * idx + 0.2}s` }}
            >
              <div className="torneo-card-content">
                <div className="torneo-nombre">{tournament.nombre}</div>
                <div className="torneo-info">
                  Inicio: {new Date(tournament.inicio).toLocaleDateString()}
                </div>
                <div className="torneo-info">
                  Final: {new Date(tournament.final).toLocaleDateString()}
                </div>
                <div className="torneo-ciudad">
                  Ciudad: {tournament.Ciudad?.nombre || 'Desconocida'}
                </div>
              </div>
              <div className="torneo-card-actions">
                <button
                  className="torneo-detalles-btn"
                  onClick={() => navigate(`/torneo/${tournament.id}`)}
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="torneos-no-data">No hay torneos disponibles.</div>
        )}
      </div>
    </div>
  );
}

export default Torneos;
