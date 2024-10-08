import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Rooms from './components/Rooms';
import ChatRoom from './components/ChatRoom';

function App() {
  const [username, setUsername] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUsername={setUsername} />} />
        <Route path="/rooms" element={<Rooms username={username} />} />
        <Route path="/room/:roomId" element={<ChatRoom username={username} />} />
      </Routes>
    </Router>
  );
}

export default App;