import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Typography } from '@mui/material';
import theme from '../theme';
import './contacto.css';
import { MdPhone, MdEmail } from 'react-icons/md';

const Contacto = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="contacto-page-container">
        <h1 className="contacto-title mb-4">Comunícate con nosotros</h1>
        <div className="activity-row" style={{ gap: 20, marginTop: 20, flexWrap: 'wrap', animation: 'none', opacity: 1 }}>
          <div style={{ flex: 2, minWidth: 320 }}>
            <p className="contacto-intro-text" style={{ opacity: 1, animation: 'none' }}>
              ¿Tienes alguna duda? Estamos encantados de ayudarte.
            </p>
            <p className="contacto-intro-text" style={{ opacity: 1, animation: 'none' }}>
              Aquí tienes nuestros medios de contacto.
            </p>
            <div className='activity-row' style={{ gap: 20, marginTop: 0, flexWrap: 'wrap', animation: 'none', opacity: 1 }}>
              <div className="activity-card" style={{ opacity: 1, animation: 'none' }}>
                <h2>
                  <MdPhone className="icon" />
                  <span style={{ fontSize: '1.6rem', color: '#F5F5F5', fontWeight: 500 }}>
                    Para llamadas:
                  </span>
                </h2>
                <span style={{ color: '#F5F5F5', fontSize: '18px' }}>
                  Charla con uno de nuestros miembros!
                </span>
                <ul className="contact-info-list">
                  <li style={{ color: '#e0e0e0' }}>Fono 1: +56 9 7952 7537</li>
                  <li style={{ color: '#e0e0e0' }}>Fono 2: +56 9 9999 9999</li>
                  <li style={{ color: '#e0e0e0' }}>Fono 3: +56 9 8888 8888</li>
                </ul>
              </div>
              <div className="activity-card" style={{ opacity: 1, animation: 'none' }}>
                <h2>
                  <MdEmail className="icon" />
                  <span style={{ fontSize: '1.6rem', color: '#F5F5F5', fontWeight: 500 }}>
                    Soporte por Correo:
                  </span>
                </h2>
                <span style={{ color: '#F5F5F5', fontSize: '17px', fontWeight: 500 }}>
                  A veces nuestras líneas podrán estar ocupadas, intenta nuestros correos electrónicos!
                </span>
                <ul className="contact-info-list">
                  <li style={{ color: '#e0e0e0' }}>- carl.hidalgo@duocuc.cl</li>
                  <li style={{ color: '#e0e0e0' }}>- masterspawnx@gmail.com</li>
                  <li style={{ color: '#e0e0e0' }}>- karloxx534@gmail.com</li>
                  <li style={{ color: '#e0e0e0' }}>- karlozoh@gmail.com</li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className="contact-image-column"
            style={{
              backgroundImage:
                "url('https://cdn.evolve-mma.com/wp-content/uploads/2021/09/manny-pacquiao-retires-from-boxing.jpg')",
              flex: 1,
              minWidth: 280,
              marginLeft: 20,
              opacity: 1,
              animation: 'none'
            }}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Contacto;
