import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import './styles.css'
import {Leva} from "leva"
import "./fonts/ACES07_Regular.ttf"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Leva />
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>,
)
