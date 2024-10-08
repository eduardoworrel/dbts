import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import { io } from 'socket.io-client';  // Importando o socket.io-client

const SOCKET_SERVER_URL = 'http://localhost:8080';  // A URL do seu servidor de socket.io

function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);  // Usaremos isso para armazenar a instância do socket
  const messagesEndRef = useRef(null); // Referência para o final da lista de mensagens
  const inputRef = useRef(null); // Referência para o campo de texto
  const [autoScroll, setAutoScroll] = useState(true); // Para verificar se a rolagem automática deve ser feita

  // Obtendo o nome de usuário do localStorage
  const username = localStorage.getItem('username');

  // Se o nome de usuário não existir, redirecionar para a página de login
  useEffect(() => {
    if (!username) {
      navigate('/login');  // Redirecionar para a página de login se não houver username
    }
  }, [username, navigate]);

  // Conectar ao Socket.IO quando o componente montar
  useEffect(() => {
    if (username) {
      socketRef.current = io(SOCKET_SERVER_URL, {
        query: { username },  // Enviando o nome de usuário na conexão
      });

      socketRef.current.emit('join_room', { roomId, username }); 

      // Receber mensagens do servidor
      socketRef.current.on('receive_message', (message) => {
        // Verificar se a mensagem não é duplicada (evitar a própria mensagem enviada)
        if (message.user !== username) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });

      // Limpar o socket quando o componente desmontar
      return () => {
        socketRef.current.disconnect();  // Desconectar do socket ao sair da sala
      };
    }
  }, [roomId, username]);

  // Função para enviar mensagens para o servidor
  const sendMessage = () => {
    if (newMessage.length === 0) {
      // Se a mensagem estiver vazia, refoque o campo de texto
      inputRef.current.focus();
      return;
    }
    const messageObj = { user: username, message: newMessage, roomId };
    socketRef.current.emit('send_message', messageObj); 
    setMessages((prevMessages) => [...prevMessages, messageObj]); 
    setNewMessage('');  
  };

  // Função para sair da sala
  const leaveRoom = () => {
    socketRef.current.disconnect();  // Desconectar do socket ao sair da sala
    navigate('/rooms');  // Redirecionar para a página de lista de salas
  };

  // Função para rolar automaticamente para o final da lista
  const scrollToBottom = () => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Verificar se o usuário está no fundo da lista para permitir auto-scroll
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    setAutoScroll(scrollHeight - scrollTop === clientHeight);
  };

  // Rolar para o final da lista quando as mensagens mudarem
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
            Room {roomId}
          </Typography>

          {/* Lista de mensagens */}
          <List
            style={{ width: '100%', maxHeight: '300px', overflowY: 'auto', backgroundColor: '#424242', padding: '10px', borderRadius: '5px' }}
            onScroll={handleScroll}  // Detectar se o usuário está no fundo da lista
          >
            {messages.map((msg, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${msg.user}: ${msg.message}`} style={{ color: '#fff' }} />
              </ListItem>
            ))}
            {/* Referência ao final da lista */}
            <div ref={messagesEndRef}></div>
          </List>

          {/* Input para nova mensagem */}
          <TextField
            fullWidth
            label="Type your message"
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage();  // Enviar mensagem ao pressionar Enter
                e.preventDefault();  // Prevenir comportamento padrão de nova linha
              }
            }}
            style={{ backgroundColor: '#424242', marginTop: '20px', borderRadius: '5px', color: '#fff' }}
            inputRef={inputRef}  // Referência para focar no campo de texto
            InputProps={{
              style: { color: '#fff' },
            }}
            InputLabelProps={{ style: { color: '#fff' } }}
          />

          {/* Botão para enviar mensagem */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={sendMessage}
            style={{ backgroundColor: '#1976D2', marginTop: '20px' }}
          >
            Send
          </Button>

          {/* Botão para sair da sala */}
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