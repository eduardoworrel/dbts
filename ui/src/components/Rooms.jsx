import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, List, ListItem, ListItemText, Container, Typography } from '@mui/material';

// Função para buscar as salas do backend
const fetchRooms = async () => {
  const response = await fetch('http://localhost:8080/api/rooms'); // Ajuste para a URL correta do seu backend
  if (response.ok) {
    return await response.json();
  } else {
    console.error('Failed to fetch rooms');
    return [];
  }
};

// Função para criar uma nova sala no backend
const createRoomApi = async () => {
  const response = await fetch('http://localhost:8080/api/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: `Room ${Date.now()}` }), // A sala pode ter um nome gerado com timestamp
  });

  if (response.ok) {
    return await response.json(); // Supondo que o backend retorne o objeto da nova sala criada
  } else {
    console.error('Failed to create room');
    return null;
  }
};

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem('username'); // Carregar o nome de usuário do localStorage

  // Se o nome de usuário não existir, redirecionar para a página de login
  useEffect(() => {
    if (!username) {
      navigate('/');
    }
  }, [username, navigate]);

  // Buscar as salas ao carregar o componente
  useEffect(() => {
    fetchRooms().then((data) => setRooms(data));
  }, []);

  // Função para criar uma nova sala e entrar nela automaticamente
  const createRoom = async () => {
    const newRoom = await createRoomApi();
    if (newRoom) {
      setRooms([...rooms, newRoom]); // Adicionar a nova sala à lista
      navigate(`/room/${newRoom.id}`); // Navegar para a nova sala criada
    }
  };

  // Função para entrar em uma sala existente
  const joinRoom = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <Container style={{ width: '100vw', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Container style={{ width: '80%', margin: '0 auto' }}>
        <Typography variant="h5" gutterBottom>
          Welcome, {username}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginBottom: '20px' }}
          onClick={createRoom}
        >
          Create Room
        </Button>
        <Typography variant="h6">Available Rooms</Typography>
        <List>
          {rooms.map((room) => (
            <ListItem key={room.id} button onClick={() => joinRoom(room.id)}>
              <ListItemText primary={room.name} />
              <Button variant="outlined" color="secondary">
                Join
              </Button>
            </ListItem>
          ))}
        </List>
      </Container>
    </Container>
  );
}

export default Rooms;