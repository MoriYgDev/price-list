// src/pages/LoginPage.tsx
import React, { useState ,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert,
  Paper // Import Paper for the card effect
} from '@mui/material';
import api from '../services/api';
import MyLogo from '../assets/afratec asli.png';


// If you have a logo file in your src/assets folder, you can uncomment this
// import MyLogo from '../assets/logo.png';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      navigate('/admin');
    } catch (err) {
      setError('نام کاربری یا رمز عبور اشتباه است.');
      console.error(err);
    }
  };
  useEffect(() => {
    document.title = 'افراتک | ورود به پنل مدیریت'; // Set the specific title for LoginPage
  }, []); //


  return (
    // 1. Full-screen container that centers its content vertically and horizontally
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
      }}
    >
      {/* 2. The card itself, using the Paper component */}
      <Paper
        elevation={6} // This controls the shadow depth
        sx={{
          p: 4, // Use 'p' for padding inside the card (4 * 8px = 32px)
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '420px', // Set a max-width for the form
          width: '100%',
        }}
      >
        <img src={MyLogo} alt="لوگوی افراتک" style={{ width: '180px', marginBottom: '24px' }} />
        <Typography component="h1" variant="h5">
          ورود به پنل مدیریت
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="نام کاربری"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="رمز عبور"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="مرا به خاطر بسپار"
          />
          {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }} // Make button a bit taller
          >
            ورود
          </Button>
        </Box>
      </Paper>
    </Box>
  );


};




export default LoginPage;