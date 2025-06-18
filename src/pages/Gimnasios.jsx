import React, { useEffect, useState } from 'react';
import supabase from '../connection/supabaseClient';
import { ThemeProvider } from '@emotion/react';
import theme from '../theme';
import { Typography } from '@mui/material';
import './Gimnasios.css'
import { apiFetch } from '../utils/api';

const Gimnasios = () => {
  const [gimnasios, setGimnasios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityName, setCityName] = useState('');


  useEffect(() => {
    const fetchGimnasios = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await apiFetch('/api/gimnasios/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los gimnasios');
        }
        const data = await response.json();
        setGimnasios(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCities = async () => {
      const { data, error } = await supabase
        .from('Ciudad')
        .select('id, nombre');

      if (error) {
        console.error('Error fetching cities:', error);
        return;
      }

      const cityMap = {};
      data.forEach(city => {
        cityMap[city.id] = city.nombre;
      });

      setCityName(cityMap);
    };
    fetchCities()
    fetchGimnasios();
  }, []);

  if (loading) return <p>Cargando gimnasios...</p>;

  if (error) return <p>{`Error: ${error}`}</p>;

  return (
    <ThemeProvider theme={theme}>
      <div className="gym-main-container">
        <h2 className="gym-title">Gimnasios asociados</h2>
        <div className="gym-list">
          {gimnasios.length === 0 ? (
            <p>No hay gimnasios registrados.</p>
          ) : (
            gimnasios.map((gym, idx) => (
              <div key={gym.id} className="gym-card visible" style={{ animationDelay: `${0.1 * idx + 0.2}s` }}>
                {gym.imagen_url && (
                  <img
                    src={gym.imagen_url}
                    alt={gym.nombre}
                    className="gym-img"
                  />
                )}
                <div className="gym-card-content">
                  <div className="gym-nombre">{gym.nombre}</div>
                  <div className="gym-info">
                    <strong>Dirección:</strong> {gym.direccion}<br />
                    <strong>Ciudad:</strong> {cityName[gym.ciudad] || 'Desconocida'}<br />
                    <strong>Teléfono:</strong> {gym.telefono}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Gimnasios;
