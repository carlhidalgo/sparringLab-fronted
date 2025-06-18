import React, { useRef, useEffect, useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './NavbarComponent.css';
import { useAuth } from '../../context/AuthContext';


function NavbarComponent() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const [logoHeight, setLogoHeight] = useState(80); 
  const [makeNavbarTransparent, setMakeNavbarTransparent] = useState(false);

  useEffect(() => {
    const currentNavbarRef = navbarRef.current;
    if (currentNavbarRef) {
      const navbarHeight = currentNavbarRef.offsetHeight;
      if (navbarHeight > 0) { 
        setLogoHeight(navbarHeight * 1.08); 
      }
    }

    const handleScroll = () => {
      const heroSection = document.querySelector('.hero-section'); // Asume que HeroSection tiene esta clase
      if (!heroSection || !currentNavbarRef) return;

      const heroSectionTop = heroSection.offsetTop;
      const heroSectionBottom = heroSectionTop + heroSection.offsetHeight;
      const navbarBottom = currentNavbarRef.offsetTop + currentNavbarRef.offsetHeight;
      const navbarTop = currentNavbarRef.offsetTop;

      // Es transparente si CUALQUIER parte de la navbar está sobre la HeroSection
      // Y la HeroSection es visible en el viewport
      const heroIsVisible = heroSectionBottom > window.scrollY && heroSectionTop < (window.scrollY + window.innerHeight);
      const navbarOverlapsHero = navbarBottom > heroSectionTop && navbarTop < heroSectionBottom;

      if (heroIsVisible && navbarOverlapsHero) {
        setMakeNavbarTransparent(true);
      } else {
        setMakeNavbarTransparent(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('DOMContentLoaded', handleScroll); // Para la carga inicial
    handleScroll(); // Ejecutar al montar

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('DOMContentLoaded', handleScroll);
    };
  }, []); 
  

const handleLogout = () => {
  logout();
  window.location.replace('/');  
};


  return (
  <Navbar 
    ref={navbarRef} 
    className={`navbar-black ${makeNavbarTransparent ? 'navbar-transparent' : ''}`} 
    variant="dark" 
    expand="lg"
  >
    <Container>
      {/* Logo a la izquierda */}
      <Navbar.Brand className="fade-in d-flex align-items-center" as={Link} to="/">
        <img
          src="./logo.png" // Cambia la ruta según donde esté tu logo
          alt="Logo"
          style={{ height: `${logoHeight}px`, width: 'auto' }} // Aplicar altura dinámica
          className="d-inline-block align-top me-2"
        />
       
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          {!user ? (
            <>
              <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
              <Nav.Link as={Link} to="/acerca">Acerca de</Nav.Link>
              <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/perfil">Perfil</Nav.Link>
              <Nav.Link as={Link} to="/gimnasios">Gimnasios</Nav.Link>
              <Nav.Link as={Link} to="/torneos">Torneos</Nav.Link>
              <Nav.Link as={Link} to="/arriendo">Reservas</Nav.Link>
              <Nav.Link as={Link} to="/clases">Clases</Nav.Link>
              <Nav.Link as={Link} to="/blog">Blog</Nav.Link>
              <Nav.Link as={Link} to="/acerca">Acerca de</Nav.Link>
              <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
              {role === 'admin' && (
                <Nav.Link as={Link} to="/PanelAdmin">Panel Admin</Nav.Link>
              )}
              <Nav.Link onClick={handleLogout}>Cerrar Sesión</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

}

export default NavbarComponent;