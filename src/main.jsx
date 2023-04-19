import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './global.scss'
import { ThemeProvider } from 'react-bootstrap'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider
    breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
    minBreakpoint="xxs"
  >
    <App />
  </ThemeProvider>,
)
