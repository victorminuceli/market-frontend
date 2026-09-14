import type {
  DadosCadastro,
  DadosLogin,
  Usuario,
} from '../tipos'

const enderecoApi = '/api'

async function enviarDados(
  caminho: string,
  dados: DadosLogin | DadosCadastro,
  mensagemErro: string,
): Promise<Usuario> {
  let resposta: Response

  try {
    resposta = await fetch(`${enderecoApi}${caminho}`, {
      method: 'POST',

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