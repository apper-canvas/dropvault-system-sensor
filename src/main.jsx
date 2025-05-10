import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { FileFolderProvider } from './context/FileFolderContext'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <FileFolderProvider>
      <App />
    </FileFolderProvider>
  </BrowserRouter>
)