import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import { io } from 'socket.io-client'; 

const SOCKET_SERVER_URL = 'http://104.131.181.50:8080';  

function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);  
  const messagesEndRef = useRef(null); 
  const inputRef = useRef(null); 
  const [autoScroll, setAutoScroll] = useState(true); 

  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      navigate('/');  
    }
  }, [username, navigate]);


  useEffect(() => {
    if (username) {
      socketRef.current = io(SOCKET_SERVER_URL, {
        query: { username },  
      });
  
      socketRef.current.emit('join_room', { roomId, username });
  
      socketRef.current.on('load_messages', (loadedMessages) => {
        setMessages(loadedMessages); 
      });
  
      socketRef.current.on('receive_message', (message) => {
        if (message.user !== username) {
            setMessages((prevMessages) => [...prevMessages, message]);
          }
      });
  
      return () => {
        socketRef.current.disconnect();  
      };
    }
  }, [roomId, username]);
  
  const sendMessage = () => {
    if (newMessage.length === 0) {
      inputRef.current.focus();
      return;
    }
    const messageObj = { user: username, message: newMessage, roomId };
    socketRef.current.emit('send_message', messageObj); 
    setMessages((prevMessages) => [...prevMessages, messageObj]); 
    setNewMessage('');  
  };

  const leaveRoom = () => {
    socketRef.current.disconnect();
    navigate('/rooms');
  };

  const scrollToBottom = () => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    setAutoScroll(scrollHeight - scrollTop === clientHeight);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Container style={{ width: '100vw', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Container style={{ width: '80%', margin: '0 auto' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            p: 3,
            backgroundColor: '#333333',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            color: '#fff',
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            {roomId}
          </Typography>

          <List
            style={{ width: '100%', height: '300px', overflowY: 'auto', backgroundColor: '#424242', padding: '10px', borderRadius: '5px' }}
            onScroll={handleScroll}  
          >
            {messages.map((msg, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${msg.user}: ${msg.message}`} style={{ color: '#fff' }} />
              </ListItem>
            ))}
            <div ref={messagesEndRef}></div>
          </List>

          <TextField
            fullWidth
            label="Type your message"
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage();  
                e.preventDefault(); 
              }
            }}
            style={{ backgroundColor: '#424242', marginTop: '20px', borderRadius: '5px', color: '#fff' }}
            inputRef={inputRef}  
            InputProps={{
              style: { color: '#fff' },
            }}
            InputLabelProps={{ style: { color: '#fff' } }}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={sendMessage}
            style={{ backgroundColor: '#1976D2', marginTop: '20px' }}
          >
            Send
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={leaveRoom}
            style={{ backgroundColor: '#D32F2F', marginTop: '10px' }}
          >
            Leave Room
          </Button>
        </Box>
      </Container>
    </Container>
  );
}

export default ChatRoom;