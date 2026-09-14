import { useState } from 'react'
import type { ReactNode } from 'react'

import { ContextoSessao } from './ContextoSessao'
import type { Usuario } from '../tipos'

interface PropriedadesSessao {
  children: ReactNode
}

const chaveSessao = 'market.usuario'

function recuperarUsuario(): Usuario | null {
  try {
    const texto = sessionStorage.getItem(chaveSessao)

    if (!texto) return null

    const dados: unknown = JSON.parse(texto)

    if (typeof dados !== 'object' || dados === null) {
      return null
    }

    if (
      !('id' in dados) ||
      !('nome' in dados) ||
      !('email' in dados)
    ) {
      return null
    }

    if (
      typeof dados.id !== 'number' ||
      !Number.isInteger(dados.id) ||
      dados.id <= 0 ||
      typeof dados.nome !== 'string' ||
      typeof dados.email !== 'string'
    ) {
      return null
    }

    return {
      id: dados.id,
      nome: dados.nome,
      email: dados.email,
    }
  } catch {
    return null
  }
}

export function ProvedorSessao({
  children: conteudo,
}: PropriedadesSessao) {
  const [usuario, definirUsuario] = useState<Usuario | null>(
    recuperarUsuario,
  )

  function iniciarSessao(dados: Usuario) {
    const usuarioPublico: Usuario = {
      id: dados.id,
      nome: dados.nome,
      email: dados.email,
    }

    definirUsuario(usuarioPublico)

    try {
      sessionStorage.setItem(
        chaveSessao,
        JSON.stringify(usuarioPublico),
      )
    } catch {

    }
  }

  function encerrarSessao() {
    definirUsuario(null)

    try {
      sessionStorage.removeItem(chaveSessao)
    } catch {

    }
  }

  return (
    <ContextoSessao.Provider
      value={{
        usuario,
        iniciarSessao,
        encerrarSessao,
      }}
    >
      {conteudo}
    </ContextoSessao.Provider>
  )
}