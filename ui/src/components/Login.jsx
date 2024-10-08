import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box } from '@mui/material';

function Login({ setUsername }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!name) {
      setError('Username is required');
      return;
    }

    try {
      // Validação no servidor
      const response = await fetch('http://backend:8080/api/validate-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name }),
      });
      const result = await response.json();

      if (result.isValid) {
        // Nome de usuário é válido
        localStorage.setItem('username', name); // Salvar no localStorage
        setUsername(name);
        navigate('/rooms');
      } else {
        // Nome de usuário já está em uso
        setError('Username already in use');
      }
    } catch (err) {
      console.error('Error validating username:', err);
      setError('Server error, please try again later.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width:'100vw',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#212121',
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            p: 3,
            borderRadius: 2,
            backgroundColor: '#333333',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h4" gutterBottom style={{ color: '#fff' }}>
            Enter your username
          </Typography>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputLabelProps={{ style: { color: '#fff' } }}
            InputProps={{
              style: { color: '#fff', borderColor: '#fff' },
            }}
            style={{
              marginBottom: '20px',
              backgroundColor: '#424242',
            }}
            error={!!error}
            helperText={error}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogin}
            style={{ backgroundColor: '#1976D2' }}
          >
            Join Chat
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;