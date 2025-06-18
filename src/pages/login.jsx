import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, TextField, Button, Typography, Alert, ThemeProvider } from '@mui/material';
import theme from '../theme';
import { Link as RouterLink } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode"; // Asegúrate de tener jwt-decode instalado
import { apiFetch } from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    console.log(' Enviando datos al backend:', formData);

    try {
      const response = await apiFetch('/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      console.log('Estado de respuesta HTTP:', response.status);

      const result = await response.json();
      console.log(' Respuesta del backend:', result);

      if (!response.ok) {
        console.warn(' Error devuelto por el backend:', result.error);
        setError(result.error || 'Error desconocido');
        return;
      }

      const { user, token } = result;
      console.log(' Usuario recibido:', user);

      if (user && user.email && user.rol) {
        localStorage.setItem('email', user.email);
        localStorage.setItem('role', user.rol);
        localStorage.setItem('token', token);

        console.log(' Email guardado en localStorage:', localStorage.getItem('email'));
        console.log('Rol guardado en localStorage:', localStorage.getItem('role'));

        login(user, token);

        console.log('🔀 Redirigiendo a /');
        navigate('/');
      } else {
        console.warn(' Usuario inválido o incompleto:', user);
        setError('Datos del usuario incompletos');
      }
    } catch (err) {
      console.error(' Error de red o servidor:', err);
      setError('Error al conectar con el servidor');
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    console.log("Google login success:", credentialResponse);
    const idToken = credentialResponse.credential;
    // Decodificar el token para ver la información (opcional, solo para depuración)
    try {
      const decodedToken = jwtDecode(idToken);
      console.log("Decoded Google ID Token:", decodedToken);

      // Aquí enviarías el idToken (o el accessToken si usas otro flujo) a tu backend
      // para verificarlo y crear/loguear al usuario en tu sistema.
      const backendResponse = await apiFetch('/api/auth/google/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });

      const result = await backendResponse.json();

      if (!backendResponse.ok) {
        setError(result.error || 'Error con el inicio de sesión de Google desde el backend');
        return;
      }

      const { user, token } = result;
      if (user && user.email && user.rol) {
        login(user, token); // Usa tu función de login existente
        navigate('/');
      } else {
        setError('Datos del usuario incompletos desde Google Sign-In');
      }

    } catch (error) {
      console.error("Error decoding Google token or during backend auth:", error);
      setError('Error procesando la autenticación con Google.');
    }
  };

  const handleGoogleLoginError = () => {
    console.error("Google login failed");
    setError('El inicio de sesión con Google falló. Por favor, inténtalo de nuevo.');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: 2,
          backgroundColor: '#0d47a1', // Fondo azul oscuro principal
          animation: 'fadeInBackground 1s ease-out' // Animación para el fondo
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: 450, // Ancho ajustado
            mx: 'auto',
            p: 4, // Padding incrementado
            backgroundColor: 'rgba(255, 255, 255, 0.98)', // Fondo blanco ligeramente translúcido
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', // Sombra más pronunciada
            animation: 'slideUpForm 0.7s ease-out forwards' // Animación para el formulario
          }}
        >
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom 
            fontWeight="bold"
            sx={{ 
              color: '#0d47a1', // Título en azul oscuro
              textTransform: 'uppercase',
              letterSpacing: '1px',
              mb: 3 // Margen inferior aumentado
            }}
          >
            Iniciar Sesión
          </Typography>

          <TextField
            variant='outlined' // Variante outlined para un look más moderno
            label="Correo Electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            sx={{ mb: 2.5 }} // Margen inferior
          />

          <TextField
            variant='outlined' // Variante outlined
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password} // Corregido: de formData.email a formData.password
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            sx={{ mb: 3 }} // Margen inferior aumentado
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2, animation: 'shake 0.5s' }}> {/* Animación para error */}
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth // Botón ocupa todo el ancho
            sx={{ 
              mt: 2, 
              py: 1.5, // Padding vertical
              fontSize: '1.1rem', // Tamaño de fuente
              fontWeight: 'bold',
              backgroundColor: '#ffd700', // Botón dorado
              color: '#0d47a1', // Texto azul oscuro
              '&:hover': {
                backgroundColor: '#ffc107', // Dorado más oscuro al pasar el mouse
                transform: 'translateY(-2px)', // Efecto hover
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)' // Sombra hover
              },
              transition: 'all 0.3s ease' // Transición suave
            }}
          >
            Entrar
          </Button>

          <Box sx={{ my: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#777' }}>
              O inicia sesión con
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              useOneTap
              theme="outline"
              size="large"
              shape="rectangular"
              width="100%" // Intenta que ocupe el ancho disponible
            />
          </Box>

          <Typography align="center" sx={{ mt: 3, color: '#555' }}>
            ¿No tienes una cuenta?
          </Typography>

          <Button 
            component={RouterLink} 
            to="/registro" 
            variant="text" 
            fullWidth
            sx={{
              mt: 1,
              color: '#1976d2', // Azul medio para el enlace
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)' // Fondo sutil al pasar el mouse
              }
            }}
          >
            Regístrate aquí
          </Button>

        </Box>
      </Box>
      {/* Estilos para las animaciones */}
      <style jsx global>{`
        @keyframes fadeInBackground {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpForm {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
      `}</style>
    </ThemeProvider>
  );

};

export default Login;

