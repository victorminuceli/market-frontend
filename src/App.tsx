import { Navigate, Route, Routes } from 'react-router-dom'

import { useSessao } from './contextos/ContextoSessao'

import Inicio from './paginas/Inicio'
import Login from './paginas/Login'
import Cadastro from './paginas/Cadastro'
import Produtos from './paginas/Produtos'
import Perfil from './paginas/Perfil'
import Carrinho from './paginas/Carrinho'

import './App.css'

function App() {
  const { usuario } = useSessao()

  return (
    <Routes>
      <Route
        path="/"
        element={
          usuario ? <Navigate to="/produtos" replace /> : <Inicio />
        }
      />

      <Route
        path="/login"
        element={
          usuario ? <Navigate to="/produtos" replace /> : <Login />
        }
      />

      <Route
        path="/cadastro"
        element={
          usuario ? <Navigate to="/produtos" replace /> : <Cadastro />
        }
      />

      <Route
        path="/produtos"
        element={
          usuario ? <Produtos /> : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/perfil"
        element={
          usuario ? <Perfil /> : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/carrinho"
        element={
          usuario ? <Carrinho /> : <Navigate to="/login" replace />
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}

export default App