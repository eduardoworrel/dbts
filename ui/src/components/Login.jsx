import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box } from '@mui/material';

function Login({ setUsername }) {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (name) {
      setUsername(name);
      navigate('/rooms');
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