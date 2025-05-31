import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ListContextProvider from './Context/ListContext'



createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ListContextProvider>
      <StrictMode>
       
          <App />
      
      </StrictMode>
    </ListContextProvider>
  </BrowserRouter>
)
