import React from 'react';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <h5>Sparringlab</h5>
        <p>Horario: Lunes a Viernes de 9:00 a 18:00</p>
        <div className="footer-social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
        </div>
        <button type="button" className="btn-custom-join">
          ¡Únete hoy!
        </button>
        <div className="footer-copyright">
          <p>&copy; {currentYear} SparringLab. Todos los derechos reservados.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;