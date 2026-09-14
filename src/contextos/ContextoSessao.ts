import { createContext, useContext } from 'react'
import type { Usuario } from '../tipos'

interface DadosSessao {
  usuario: Usuario | null
  iniciarSessao: (dados: Usuario) => void
  encerrarSessao: () => void
}

export const ContextoSessao = createContext<
  DadosSessao | undefined
>(undefined)

export function usarSessao(): DadosSessao {
  const contexto = useContext(ContextoSessao)

  if (!contexto) {
    throw new Error(
      'usarSessao deve ser utilizado dentro de ProvedorSessao.',
    )
  }

  return contexto
}