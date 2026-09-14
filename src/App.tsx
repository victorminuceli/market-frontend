import { Route, Routes } from 'react-router-dom'

import Inicio from './paginas/Inicio'
import Login from './paginas/Login'
import Cadastro from './paginas/Cadastro'

import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
    </Routes>
  )
}

export default App