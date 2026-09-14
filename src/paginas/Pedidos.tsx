import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useSessao } from '../contextos/ContextoSessao'
import { listarPedidos } from '../servicos/pedidosApi'
import type { Pedido, StatusPedido } from '../tipos'

import '../estilos/pedidos.css'

const formatoMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const formatoData = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

const nomesStatus: Record<StatusPedido, string> = {
  RECEBIDO: 'Recebido',
  FINALIZADO: 'Finalizado',
}

function formatarData(data: string): string {
  const dataConvertida = new Date(data)

  if (Number.isNaN(dataConvertida.getTime())) {
    return 'Data indisponível'
  }

  return formatoData.format(dataConvertida)
}

function Pedidos() {
  const { usuario, encerrarSessao } = useSessao()

  const [pedidos, definirPedidos] = useState<Pedido[]>([])
  const [carregando, definirCarregando] = useState(true)
  const [erro, definirErro] = useState('')
  const [tentativa, definirTentativa] = useState(0)

  const usuarioId = usuario?.id

  useEffect(() => {
    if (usuarioId === undefined) return

    let ativo = true
    const identificadorUsuario = usuarioId

    async function carregarPedidos() {
      try {
        const pedidosEncontrados = await listarPedidos(
          identificadorUsuario,
        )

        if (ativo) {
          definirPedidos(pedidosEncontrados)
        }
      } catch (falha) {
        if (ativo) {
          definirErro(
            falha instanceof Error
              ? falha.message
              : 'Não foi possível carregar seus pedidos.',
          )
        }
      } finally {
        if (ativo) {
          definirCarregando(false)
        }
      }
    }

    carregarPedidos()

    return () => {
      ativo = false
    }
  }, [usuarioId, tentativa])

  function tentarNovamente() {
    definirErro('')
    definirCarregando(true)
    definirTentativa((valorAtual) => valorAtual + 1)
  }

  return (
    <div className="pagina-pedidos">
      <header className="cabecalho">
        <Link
          className="marca"
          to="/produtos"
          aria-label="Market — produtos"
        >
          market<span>.</span>
        </Link>

        <nav className="navegacao" aria-label="Menu principal">
          <Link
            className="botao botao-secundario"
            to="/produtos"
          >
            Produtos
          </Link>

          <Link
            className="botao botao-secundario"
            to="/carrinho"
          >
            Meu carrinho
          </Link>

          <Link
            className="botao botao-secundario"
            to="/perfil"
          >
            Meu perfil
          </Link>

          <button
            className="botao botao-secundario botao-sair"
            type="button"
            onClick={encerrarSessao}
          >
            Sair
          </button>
        </nav>
      </header>

      <main className="conteudo-pedidos">
        <div className="titulo-pedidos">
          <h1>Meus pedidos</h1>
          <p>
            Consulte suas compras e veja os detalhes de cada pedido.
          </p>
        </div>

        {carregando ? (
          <div className="estado-pedidos" role="status">
            <p>Carregando seus pedidos…</p>
          </div>
        ) : erro ? (
          <div className="estado-pedidos">
            <p role="alert">{erro}</p>

            <button
              className="botao botao-principal"
              type="button"
              onClick={tentarNovamente}
            >
              Tentar novamente
            </button>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="estado-pedidos">
            <h2>Sua primeira compra começa aqui.</h2>

            <p>
              Você ainda não tem pedidos. Explore o catálogo
              e adicione seus produtos ao carrinho.
            </p>

            <Link
              className="botao botao-principal"
              to="/produtos"
            >
              Explorar produtos
            </Link>
          </div>
        ) : (
          <div className="lista-pedidos">
            {pedidos.map((pedido) => {
              const quantidadeTotal = pedido.itens.reduce(
                (total, item) => total + item.quantidade,
                0,
              )

              return (
                <article
                  className="cartao-pedido"
                  key={pedido.id}
                >
                  <div className="cabecalho-pedido">
                    <div>
                      <h2>Pedido #{pedido.id}</h2>

                      <time
                        className="data-pedido"
                        dateTime={pedido.data}
                      >
                        {formatarData(pedido.data)}
                      </time>
                    </div>

                    <span className="status-pedido">
                      {nomesStatus[pedido.status] ?? pedido.status}
                    </span>
                  </div>

                  <div className="total-pedido">
                    <span>
                      {quantidadeTotal}{' '}
                      {quantidadeTotal === 1
                        ? 'unidade'
                        : 'unidades'}
                    </span>

                    <strong>
                      Total: {formatoMoeda.format(pedido.valorTotal)}
                    </strong>
                  </div>

                  <details className="detalhes-pedido">
                    <summary>Ver itens do pedido</summary>

                    <ul className="itens-pedido">
                      {pedido.itens.map((item) => (
                        <li className="item-pedido" key={item.id}>
                          <div>
                            <h3>{item.produto.nome}</h3>

                            <p>
                              {item.quantidade} ×{' '}
                              {formatoMoeda.format(item.preco)}
                              {' '}por unidade
                            </p>
                          </div>

                          <strong>
                            {formatoMoeda.format(
                              item.preco * item.quantidade,
                            )}
                          </strong>
                        </li>
                      ))}
                    </ul>
                  </details>
                </article>
              )
            })}
          </div>
        )}
      </main>

      <footer className="rodape">
        <span className="marca-rodape">market.</span>
        <span>Seu mercado, mais perto.</span>
      </footer>
    </div>
  )
}

export default Pedidos