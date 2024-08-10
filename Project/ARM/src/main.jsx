import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// main.jsx is where React first creates its Virtual DOM (Document Object Model).
// The first true layer (React component) is App.jsx.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
