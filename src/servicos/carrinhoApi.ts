import type { Carrinho } from '../tipos'

const enderecoApi = '/api/carrinhos'

type MetodoCarrinho = 'GET' | 'POST' | 'PUT' | 'DELETE'

async function requisitarCarrinho(
  caminho: string,
  metodo: MetodoCarrinho,
): Promise<Response> {
  let resposta: Response

  try {
    resposta = await fetch(`${enderecoApi}${caminho}`, {
      method: metodo,
      signal: AbortSignal.timeout(15000),
    })
  } catch {
    throw new Error(
      'Não foi possível obter a resposta do servidor. Confira a conexão e recarregue o carrinho antes de repetir a operação.',
    )
  }

  if (!resposta.ok) {
    throw new Error(
      `Não foi possível realizar a operação no carrinho. Código HTTP: ${resposta.status}.`,
    )
  }

  return resposta
}

function validarQuantidade(quantidade: number): void {
  if (!Number.isInteger(quantidade) || quantidade < 1) {
    throw new Error(
      'A quantidade deve ser um número inteiro maior que zero.',
    )
  }
}

export async function buscarCarrinho(
  usuarioId: number,
): Promise<Carrinho> {
  const resposta = await requisitarCarrinho(
    `/${usuarioId}`,
    'GET',
  )

  return resposta.json() as Promise<Carrinho>
}

export async function adicionarProdutoAoCarrinho(
  usuarioId: number,
  produtoId: number,
  quantidade: number = 1,
): Promise<Carrinho> {
  validarQuantidade(quantidade)

  const resposta = await requisitarCarrinho(
    `/${usuarioId}/itens/${produtoId}?quantidade=${quantidade}`,
    'POST',
  )

  return resposta.json() as Promise<Carrinho>
}

export async function atualizarQuantidadeItem(
  usuarioId: number,
  itemId: number,
  quantidade: number,
): Promise<Carrinho> {
  validarQuantidade(quantidade)

  const resposta = await requisitarCarrinho(
    `/${usuarioId}/itens/${itemId}?quantidade=${quantidade}`,
    'PUT',
  )

  return resposta.json() as Promise<Carrinho>
}

export async function removerItemDoCarrinho(
  usuarioId: number,
  itemId: number,
): Promise<void> {
  await requisitarCarrinho(
    `/${usuarioId}/itens/${itemId}`,
    'DELETE',
  )

}