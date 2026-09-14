import type { Pedido } from '../tipos'

const enderecoApi = '/api/pedidos'

type MetodoPedido = 'GET' | 'POST'

async function requisitarPedido<T>(
  caminho: string,
  metodo: MetodoPedido,
): Promise<T> {
  let resposta: Response

  try {
    resposta = await fetch(`${enderecoApi}${caminho}`, {
      method: metodo,
      signal: AbortSignal.timeout(15000),
    })
  } catch {
    if (metodo === 'POST') {
      throw new Error(
        'Não foi possível confirmar a finalização. Consulte seus pedidos antes de tentar novamente.',
      )
    }

    throw new Error(
      'Não foi possível consultar os pedidos. Confira se o backend está funcionando.',
    )
  }

  if (!resposta.ok) {
    if (metodo === 'POST') {
      throw new Error(
        `Não foi possível confirmar a compra. Consulte seus pedidos e confira o carrinho antes de tentar novamente. Código HTTP: ${resposta.status}.`,
      )
    }

    throw new Error(
      `Não foi possível consultar o pedido. Código HTTP: ${resposta.status}.`,
    )
  }

  try {
    return (await resposta.json()) as T
  } catch {
    throw new Error(
      metodo === 'POST'
        ? 'O servidor respondeu, mas não foi possível ler a confirmação. Consulte seus pedidos antes de tentar novamente.'
        : 'O servidor retornou uma resposta inválida ao consultar os pedidos.',
    )
  }
}

export function finalizarCompra(
  usuarioId: number,
): Promise<Pedido> {
  return requisitarPedido<Pedido>(
    `/${usuarioId}/finalizar`,
    'POST',
  )
}

export function listarPedidos(
  usuarioId: number,
): Promise<Pedido[]> {
  return requisitarPedido<Pedido[]>(
    `/${usuarioId}`,
    'GET',
  )
}

export function buscarPedido(
  usuarioId: number,
  pedidoId: number,
): Promise<Pedido> {
  return requisitarPedido<Pedido>(
    `/${usuarioId}/${pedidoId}`,
    'GET',
  )
}