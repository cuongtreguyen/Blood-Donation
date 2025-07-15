import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { ToastContainer } from 'react-toastify'
import App from './App.jsx'
import 'antd/dist/reset.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer />
  </StrictMode>,
)
