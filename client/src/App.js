import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Collaborators from './pages/collaborators';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collaborators" element={<Collaborators />} />
      </Routes>
    </Router>
  );
}

export default App;
