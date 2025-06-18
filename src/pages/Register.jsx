import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import CitySelect from '../components/CitySelect';
import { TextField, Button, Box, Typography, ThemeProvider, Divider } from '@mui/material';
import theme from '../theme';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode"; // Asegúrate de tener jwt-decode instalado
import { apiFetch } from '../utils/api';

const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
  return emailRegex.test(email);
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    birthdate: '',
    city: '',
    rol: 1,
  });

  const [cities, setCities] = useState([]);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      const { data, error } = await supabase
        .from('Ciudad')
        .select('id, nombre');

      if (error) {
        console.error('Error fetching cities:', error);
      } else {
        setCities(data || []);
      }
    };

    fetchCities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      if (!isValidEmail(value)) {
        setEmailError('Correo electrónico no válido');
      } else {
        setEmailError('');
      }
    }
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCityChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      city: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');

    const trimmedEmail = formData.email.trim();

    if (!isValidEmail(trimmedEmail)) {
      console.log('Invalid email:', trimmedEmail);
      setEmailError('Correo electrónico no válido');
      return;
    }

    try {
      const response = await apiFetch('/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          email: trimmedEmail,
        }),

      });

      const data = await response.json();

      if (response.ok) {
        alert('¡Registro exitoso!');
        navigate('/login');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error('Error al registrar:', err);
      alert('Ocurrió un error al registrar.');
    }
  };

  const handleGoogleRegisterSuccess = async (credentialResponse) => {
    console.log("Google register success:", credentialResponse);
    const idToken = credentialResponse.credential;
    try {
      const decodedToken = jwtDecode(idToken);
      console.log("Decoded Google ID Token for registration:", decodedToken);

      // Enviar el token al backend para registrar al usuario
      // Este endpoint debería manejar la creación de un nuevo usuario si no existe
      // y luego loguearlo, devolviendo el usuario y el token de tu aplicación.
      const backendResponse = await apiFetch('/api/auth/google/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });

      const result = await backendResponse.json();

      if (!backendResponse.ok) {
        alert('Error en el registro con Google: ' + (result.error || 'Error desconocido del backend'));
        return;
      }
      
      // Asumiendo que el backend devuelve { user, token } similar al login normal
      // y que tu AuthContext tiene una función login.
      // Si no tienes `login` en este contexto, necesitarás una forma de establecer el estado de autenticación.
      alert('¡Registro con Google exitoso!');
      // Aquí podrías llamar a una función de login de tu AuthContext si el backend devuelve el usuario y token
      // Ejemplo: auth.login(result.user, result.token);
      navigate('/login'); // O redirigir a perfil o dashboard

    } catch (error) {
      console.error("Error processing Google registration:", error);
      alert('Error procesando el registro con Google.');
    }
  };

  const handleGoogleRegisterError = () => {
    console.error("Google register failed");
    alert('El registro con Google falló. Por favor, inténtalo de nuevo o usa el formulario normal.');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box component="form" onSubmit={handleSubmit}
        sx={{
          maxWidth: 600,
          mx: 'auto',
          mt: 4,
          fontFamily: 'Anton, sans-serif',
          fontSize: '15px',
        }}>
        <Typography variant="h5" gutterBottom>
          Formulario de registro
        </Typography>
        <TextField
          id="standard-basic"
          variant="standard"
          fullWidth
          label="Correo Electrónico"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          id="standard-basic"
          variant="standard"
          fullWidth
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          id="standard-basic"
          variant="standard"
          fullWidth
          label="Nombre"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          id="standard-basic"
          variant="standard"
          fullWidth
          label="Apellido"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <CitySelect
          cities={cities}
          city={formData.city}
          onChange={handleCityChange}
        />
        <TextField
          id="standard-basic"
          variant="standard"
          fullWidth
          label="Fecha de Nacimiento"
          name="birthdate"
          type="date"
          value={formData.birthdate}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2, mb: 2, mx: 'auto', display: 'block' }} // Añadido mb: 2
        >
          Registrarse
        </Button>

        <Divider sx={{ my: 2 }}>O</Divider>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <GoogleLogin
            onSuccess={handleGoogleRegisterSuccess}
            onError={handleGoogleRegisterError}
            useOneTap={false} // oneTap puede no ser ideal para la página de registro explícito
            theme="outline"
            size="large"
            shape="rectangular"
            text="signup_with" // Cambia el texto del botón a "Registrarse con Google"
          />
        </Box>

      </Box>
    </ThemeProvider>
  );
};


export default Register;
