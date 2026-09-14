import type {
  DadosAtualizacaoUsuario,
  DadosCadastro,
  DadosLogin,
  Produto,
  Usuario,
} from '../tipos'

const enderecoApi = '/api'

async function enviarDados(
  caminho: string,
  dados: DadosLogin | DadosCadastro | DadosAtualizacaoUsuario,
  mensagemErro: string,
  metodo: 'POST' | 'PUT' = 'POST',
): Promise<Usuario> {
  let resposta: Response

  try {
    resposta = await fetch(`${enderecoApi}${caminho}`, {
      method: metodo,

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(dados),

      signal: AbortSignal.timeout(15000),
    })
  } catch {
    throw new Error(
      'Não foi possível conectar ao servidor. Verifique se o backend está rodando e tente novamente.',
    )
  }

  if (!resposta.ok) {
    throw new Error(mensagemErro)
  }

  const usuario: Usuario = await resposta.json()

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  }
}

async function consultarDados<T>(
  caminho: string,
  mensagemErro: string,
): Promise<T> {
  let resposta: Response

  try {
    resposta = await fetch(`${enderecoApi}${caminho}`, {
      signal: AbortSignal.timeout(15000),
    })
  } catch {
    throw new Error(
      'Não foi possível conectar ao servidor. Verifique se o backend está rodando.',
    )
  }

  if (!resposta.ok) {
    throw new Error(mensagemErro)
  }

  return resposta.json() as Promise<T>
}

export function realizarLogin(
  dados: DadosLogin,
): Promise<Usuario> {
  return enviarDados(
    '/usuarios/login',
    {
      email: dados.email.trim(),
      senha: dados.senha,
    },
    'Não foi possível entrar. Confira seu e-mail e senha. Se o problema continuar, verifique o backend.',
  )
}

export function cadastrarUsuario(
  dados: DadosCadastro,
): Promise<Usuario> {
  return enviarDados(
    '/usuarios',
    {
      nome: dados.nome.trim(),
      email: dados.email.trim(),
      senha: dados.senha,
    },
    'Não foi possível cadastrar. Confira os dados e se o e-mail já está cadastrado. Se o problema continuar, verifique o backend.',
  )
}

export function listarProdutos(): Promise<Produto[]> {
  return consultarDados<Produto[]>(
    '/produtos',
    'Não foi possível carregar os produtos. Tente novamente.',
  )
}

export async function buscarUsuario(
  identificador: number,
): Promise<Usuario> {
  const usuario = await consultarDados<Usuario>(
    `/usuarios/${identificador}`,
    'Não foi possível carregar seu perfil. Tente novamente.',
  )

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  }
}

export function atualizarUsuario(
  identificador: number,
  dados: DadosAtualizacaoUsuario,
): Promise<Usuario> {
  const dadosAtualizados: DadosAtualizacaoUsuario = {
    nome: dados.nome.trim(),
    email: dados.email.trim(),
  }

  if (dados.senha && dados.senha.trim().length > 0) {
    dadosAtualizados.senha = dados.senha
  }

  return enviarDados(
    `/usuarios/${identificador}`,
    dadosAtualizados,
    'Não foi possível atualizar o perfil. Confira os dados, se o e-mail já está em uso e se a nova senha tem pelo menos 6 caracteres. Se o problema continuar, verifique o backend.',
    'PUT',
  )
}