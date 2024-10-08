import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, List, ListItem, ListItemText, Container, Typography } from '@mui/material';

const fetchRooms = async () => {
  const response = await fetch('http://104.131.181.50:8080/api/rooms');
  if (response.ok) {
    return await response.json();
  } else {
    console.error('Failed to fetch rooms');
    return {};
  }
};

const createRoomApi = async () => {
  const response = await fetch('http://104.131.181.50:8080/api/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }, 
  });

  if (response.ok) {
    return await response.json(); 
  } else {
    console.error('Failed to create room');
    return null;
  }
};

function Rooms() {
  const [rooms, setRooms] = useState({});
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      navigate('/');
    }
  }, [username, navigate]);

  useEffect(() => {
    fetchRooms().then((data) => setRooms(data));
  }, []);

  const createRoom = async () => {
    const newRoom = await createRoomApi();
    if (newRoom) {
      setRooms({ ...rooms, [newRoom.name]: newRoom });
      navigate(`/room/${newRoom.name}`); 
    }
  };

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
          {Object.entries(rooms).map(([_, room]) => (
            <ListItem key={room.id} button onClick={() => joinRoom(room.name)}>
              <ListItemText primary={room.id} />
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