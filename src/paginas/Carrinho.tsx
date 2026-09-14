import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useSessao } from '../contextos/ContextoSessao'
import {
  atualizarQuantidadeItem,
  buscarCarrinho,
  removerItemDoCarrinho,
} from '../servicos/carrinhoApi'

import type {
  Carrinho as DadosCarrinho,
  ItemCarrinho,
  Produto,
} from '../tipos'

import '../estilos/carrinho.css'

const formatoMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function FotoItem({ produto }: { produto: Produto }) {
  const [enderecoComErro, definirEnderecoComErro] = useState('')

  const enderecoImagem = produto.imagemUrl
    ? `/api${produto.imagemUrl}`
    : ''

  return (
    <div className="imagem-item-carrinho">
      {enderecoImagem && enderecoImagem !== enderecoComErro ? (
        <img
          src={enderecoImagem}
          alt={produto.nome}
          loading="lazy"
          onError={() => {
            definirEnderecoComErro(enderecoImagem)
          }}
        />
      ) : (
        <span aria-hidden="true">
          {produto.nome.slice(0, 1).toLocaleUpperCase('pt-BR')}
        </span>
      )}
    </div>
  )
}

function Carrinho() {
  const { usuario, encerrarSessao } = useSessao()

  const [carrinho, definirCarrinho] = useState<DadosCarrinho | null>(null)
  const [carregando, definirCarregando] = useState(true)
  const [erro, definirErro] = useState('')
  const [mensagem, definirMensagem] = useState('')
  const [tentativa, definirTentativa] = useState(0)

  const [itemProcessando, definirItemProcessando] =
    useState<number | null>(null)

  const usuarioId = usuario?.id

  useEffect(() => {
    if (usuarioId === undefined) return

    let ativo = true

    async function carregarCarrinho(identificadorUsuario: number) {
      try {
        const dados = await buscarCarrinho(identificadorUsuario)

        if (ativo) {
          definirCarrinho(dados)
        }
      } catch (falha) {
        if (ativo) {
          definirErro(
            falha instanceof Error
              ? falha.message
              : 'Não foi possível carregar o carrinho.',
          )
        }
      } finally {
        if (ativo) {
          definirCarregando(false)
        }
      }
    }

    carregarCarrinho(usuarioId)

    return () => {
      ativo = false
    }
  }, [usuarioId, tentativa])

  function tentarNovamente() {
    definirErro('')
    definirMensagem('')
    definirCarrinho(null)
    definirCarregando(true)
    definirTentativa((valorAtual) => valorAtual + 1)
  }

  async function executarOperacao(
    itemId: number,
    operacao: () => Promise<unknown>,
    mensagemSucesso: string,
  ) {
    if (usuarioId === undefined || itemProcessando !== null) return

    definirItemProcessando(itemId)
    definirErro('')
    definirMensagem('')

    try {
      await operacao()

      const dadosAtualizados = await buscarCarrinho(usuarioId)

      definirCarrinho(dadosAtualizados)
      definirMensagem(mensagemSucesso)
    } catch (falha) {
      definirCarrinho(null)

      definirErro(
        falha instanceof Error
          ? falha.message
          : 'Não foi possível confirmar a operação.',
      )
    } finally {
      definirItemProcessando(null)
    }
  }

  function alterarQuantidade(
    item: ItemCarrinho,
    novaQuantidade: number,
  ) {
    if (
      usuarioId === undefined ||
      !Number.isInteger(novaQuantidade) ||
      novaQuantidade < 1
    ) {
      return
    }

    executarOperacao(
      item.id,
      () => atualizarQuantidadeItem(usuarioId, item.id, novaQuantidade),
      `Quantidade de ${item.produto.nome} atualizada.`,
    )
  }

  function removerItem(item: ItemCarrinho) {
    if (usuarioId === undefined) return

    executarOperacao(
      item.id,
      () => removerItemDoCarrinho(usuarioId, item.id),
      `${item.produto.nome} foi removido do carrinho.`,
    )
  }

  const quantidadeTotal = carrinho?.itens.reduce(
    (total, item) => total + item.quantidade,
    0,
  ) ?? 0

  const processando = itemProcessando !== null

  return (
    <div className="pagina-carrinho">
      <header className="cabecalho">
        <Link
          className="marca"
          to="/produtos"
          aria-label="Market — produtos"
        >
          market<span>.</span>
        </Link>

        <nav className="navegacao" aria-label="Menu principal">
          <Link className="link-entrar" to="/produtos">
            Produtos
          </Link>

          <Link className="link-entrar" to="/perfil">
            Meu perfil
          </Link>

          <button
            className="botao botao-secundario botao-carrinho"
            type="button"
            onClick={encerrarSessao}
            disabled={processando}
          >
            Sair
          </button>
        </nav>
      </header>

      <main className="conteudo-carrinho">
        <div className="titulo-carrinho">
          <span className="etiqueta">SUAS ESCOLHAS</span>
          <h1>Meu carrinho</h1>
          <p>Confira seus produtos e ajuste as quantidades.</p>
        </div>

        {mensagem && (
          <p className="mensagem-carrinho" role="status">
            {mensagem}
          </p>
        )}

        {carregando ? (
          <div className="estado-carrinho" role="status">
            <p>Carregando seu carrinho…</p>
          </div>
        ) : erro ? (
          <div className="estado-carrinho">
            <p role="alert">{erro}</p>
            <p>Recarregue o carrinho para conferir os dados atuais.</p>

            <button
              className="botao botao-principal botao-carrinho"
              type="button"
              onClick={tentarNovamente}
            >
              Recarregar carrinho
            </button>
          </div>
        ) : carrinho && carrinho.itens.length === 0 ? (
          <div className="estado-carrinho">
            <h2>Seu carrinho está vazio.</h2>
            <p>Explore o catálogo para escolher seus produtos.</p>

            <Link className="botao botao-principal" to="/produtos">
              Explorar produtos
            </Link>
          </div>
        ) : carrinho ? (
          <div className="estrutura-carrinho" aria-busy={processando}>
            <section
              className="lista-carrinho"
              aria-label="Produtos no carrinho"
            >
              {carrinho.itens.map((item) => (
                <article className="item-carrinho" key={item.id}>
                  <FotoItem produto={item.produto} />

                  <div className="dados-item-carrinho">
                    <span className="categoria-item-carrinho">
                      {item.produto.categoria}
                    </span>

                    <h2>{item.produto.nome}</h2>

                    <p className="preco-unitario-carrinho">
                      {formatoMoeda.format(item.produto.preco)} por unidade
                    </p>

                    <div className="acoes-item-carrinho">
                      <div
                        className="controle-quantidade"
                        role="group"
                        aria-label={`Quantidade de ${item.produto.nome}`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            alterarQuantidade(item, item.quantidade - 1)
                          }}
                          disabled={processando || item.quantidade <= 1}
                          aria-label={`Diminuir quantidade de ${item.produto.nome}`}
                        >
                          −
                        </button>

                        <span>{item.quantidade}</span>

                        <button
                          type="button"
                          onClick={() => {
                            alterarQuantidade(item, item.quantidade + 1)
                          }}
                          disabled={
                            processando || item.quantidade >= 2147483647
                          }
                          aria-label={`Aumentar quantidade de ${item.produto.nome}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="remover-item-carrinho"
                        type="button"
                        onClick={() => {
                          removerItem(item)
                        }}
                        disabled={processando}
                        aria-label={`Remover ${item.produto.nome} do carrinho`}
                      >
                        Remover
                      </button>
                    </div>

                    {itemProcessando === item.id && (
                      <p className="aviso-processando" role="status">
                        Atualizando item…
                      </p>
                    )}
                  </div>

                  <div className="subtotal-item-carrinho">
                    <span>Subtotal</span>

                    <strong>
                      {formatoMoeda.format(
                        item.produto.preco * item.quantidade,
                      )}
                    </strong>
                  </div>
                </article>
              ))}
            </section>

            <aside
              className="resumo-carrinho"
              aria-labelledby="titulo-resumo"
            >
              <h2 id="titulo-resumo">Resumo do carrinho</h2>

              <div className="linha-resumo">
                <span>Unidades</span>
                <strong>{quantidadeTotal}</strong>
              </div>

              <div className="linha-resumo total-carrinho">
                <span>Total</span>
                <strong>{formatoMoeda.format(carrinho.total)}</strong>
              </div>

              <Link
                className="botao botao-secundario continuar-comprando"
                to="/produtos"
              >
                Continuar comprando
              </Link>
            </aside>
          </div>
        ) : null}
      </main>

      <footer className="rodape">
        <span className="marca-rodape">market.</span>
        <span>Seu mercado, mais perto.</span>
      </footer>
    </div>
  )
}

export default Carrinho