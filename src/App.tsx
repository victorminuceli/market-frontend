import { Route, Routes } from 'react-router-dom'

import Inicio from './paginas/Inicio'
import Login from './paginas/Login'
import Cadastro from './paginas/Cadastro'
import Produtos from './paginas/Produtos'

import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/produtos" element={<Produtos />} />
    </Routes>
  )
}

export default App