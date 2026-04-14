import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Chart as ChartJS } from 'chart.js'

// Bootstrap CSS + Icons
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Estilos do Bolso Direito (complementa Bootstrap)
import './styles/bolso-direito.css'
import './styles/metas.css'
import './styles/transacoes.css'
import './styles/teclado.css'

// Chart.js defaults (mesmas configs do HTML original)
ChartJS.defaults.font.family = "'DM Sans', sans-serif"
ChartJS.defaults.color = '#8a9bbf'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
