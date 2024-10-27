import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// CREDITS: many thanks to Dylan Kroft for pointing me to the necessary resources
// to learn JavaScript, React, and Firebase. If I ever felt lost, I could count
// on you to push me in the right direction.

// main.jsx is where React first creates its Virtual DOM (Document Object Model).
// The first true layer (React component) is App.jsx.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
