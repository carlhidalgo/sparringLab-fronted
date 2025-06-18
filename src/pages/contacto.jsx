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
        <div className="row">
          <div className="col-md-6">
            <p className="contacto-intro-text">
              ¿Tienes alguna duda? Estamos encantados de ayudarte.
            </p>
            <p className="contacto-intro-text">
              Aquí tienes nuestros medios de contacto.
            </p>
            <div className='activity-row'>
              <div
                className="activity-card"
              >
                <h2>
                  <MdPhone className="icon" />
                  <Typography variant="h2" component="span" sx={{ fontSize: '1.6rem !important', color: '#F5F5F5 !important' }}>
                    Para llamadas:
                  </Typography>
                </h2>
                <Typography variant="subtitle1" component="h6" sx={{ color: '#F5F5F5 !important', fontSize: '18px' }}>
                  Charla con uno de nuestros miembros!
                </Typography>
                <ul className="contact-info-list">
                  <li>
                    <Typography variant="body1" component="span" sx={{ color: '#F5F5F5 !important', fontSize: '17px', fontWeight: 400 }}>
                      Fono 1: +56 9 7952 7537
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" component="span" sx={{ color: '#F5F5F5 !important', fontSize: '17px', fontWeight: 400 }}>
                      Fono 2: +56 9 9999 9999
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" component="span" sx={{ color: '#F5F5F5 !important', fontSize: '17px', fontWeight: 400}}>
                      Fono 3: +56 9 8888 8888
                    </Typography>
                  </li>
                </ul>
              </div>
              <div
                className="activity-card"
              >
                 <h2>
                  <MdEmail className="icon" />
                  <Typography variant="h2" component="span" sx={{ fontSize: '1.6rem !important', color: '#F5F5F5 !important' }}>
                    Soporte por Correo:
                  </Typography>
                </h2>
                <Typography variant="subtitle1" component="h6" sx={{ color: '#F5F5F5 !important', fontSize: '17px', fontWeight: 500}}>
                  A veces nuestras líneas podrán estar ocupadas,
                  intenta nuestros correos electrónicos!
                </Typography>
                <ul className="contact-info-list">
                  <li>
                    <Typography variant="body1" component="span" sx={{ color: '#F5F5F5 !important', fontSize: '17px', fontWeight: 400}}>
                      - carl.hidalgo@duocuc.cl <br />
                      - masterspawnx@gmail.com <br />
                      - karloxx534@gmail.com <br />
                      - karlozoh@gmail.com <br />
                    </Typography>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className="col-md-6 contact-image-column"
            style={{
              backgroundImage:
                "url('https://cdn.evolve-mma.com/wp-content/uploads/2021/09/manny-pacquiao-retires-from-boxing.jpg')",
            }}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Contacto;
