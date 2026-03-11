import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Если у тебя есть глобальные стили Tailwind
import App from './App.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);