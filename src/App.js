import { Routes, Route, useLocation } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import PublicRoute from './context/AuthContext.jsx';
import NavbarComponent from './components/Navbar/NavbarComponent'; // Corregido
import Footer from './components/footer/Footer'; // Corregido (asumiendo que está en components/footer/Footer.jsx)
import Register from './pages/Register'; // Corregido
import Login from './pages/login'; // Corregido
import Home from './pages/home'; // Corregido
import Profile from './pages/Profile'; // Corregido
import Arriendo from './pages/Arriendo'; // Corregido
import Gimnasios from './pages/Gimnasios'; // Corregido
import Clases from './pages/Clases'; // Corregido
import AcercaDe from './pages/acerca'; // Corregido
import Contacto from './pages/contacto.jsx'; // Mantenido (asumiendo que está en components/contacto.jsx)
import Blogs from './pages/Blog'; // Corregido
import PrivateLayout from './components/PrivateLayout';
import NotFound from './components/NotFound';
import Torneos from './pages/Torneos.jsx'; // Corregido
import CrearTorneo from './pages/Creartorneo.jsx';
import PanelAdmin from './components/PanelAdmin.jsx';
import Mensualidad from './components/Mensualidad.jsx';
import Calendario from './components/Calendario.jsx';

function App() {
  const location = useLocation();

  const noFooterRoutes = ['/perfil','/registro','/arriendo','/contacto','/calendario'];

  const hideFooter = noFooterRoutes.includes(location.pathname);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavbarComponent />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/acerca" element={<AcercaDe />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<NotFound />} />

          {/* Public Protected Routes */}
          <Route
            path="/registro"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Private Routes */}
          <Route element={<PrivateLayout />}>
            <Route path="/perfil" element={<Profile />} />
            <Route path="/arriendo" element={<Arriendo />} />
            <Route path="/gimnasios" element={<Gimnasios />} />
            <Route path="/clases" element={<Clases />} />
            <Route path="/blog" element={<Blogs />} />
            <Route path="/Torneos" element={<Torneos />} />
            <Route path="/PanelAdmin" element={<PanelAdmin />} />
            <Route path="/pago_mensualidad" element={<Mensualidad />} />
            <Route path="/calendario" element={<Calendario />} />
            <Route path="/creartorneo" element={<CrearTorneo />} />
          </Route>
        </Routes>
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;

