import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useSessao } from '../contextos/ContextoSessao'
import { listarProdutos } from '../servicos/api'
import { adicionarProdutoAoCarrinho } from '../servicos/carrinhoApi'
import type { Produto } from '../tipos'

import '../estilos/produtos.css'

const formatoMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

interface PropriedadesImagemProduto {
  produto: Produto
}

function ImagemProduto({ produto }: PropriedadesImagemProduto) {
  const [enderecoComErro, definirEnderecoComErro] = useState('')

  const enderecoImagem = produto.imagemUrl
    ? `/api${produto.imagemUrl}`
    : ''

  if (enderecoImagem && enderecoImagem !== enderecoComErro) {
    return (
      <div className="visual-produto">
        <img
          className="foto-produto"
          src={enderecoImagem}
          alt={produto.nome}
          loading="lazy"
          decoding="async"
          onError={() => {
            definirEnderecoComErro(enderecoImagem)
          }}
        />
      </div>
    )
  }

  return (
    <div className="visual-produto" aria-hidden="true">
      <span className="inicial-produto">
        {produto.nome.slice(0, 1).toLocaleUpperCase('pt-BR')}
      </span>

      <span className="legenda-produto">
        MARKET / SELEÇÃO
      </span>
    </div>
  )
}

function Produtos() {
  const { usuario, encerrarSessao } = useSessao()

  const [produtos, definirProdutos] = useState<Produto[]>([])
  const [busca, definirBusca] = useState('')
  const [categoria, definirCategoria] = useState('')
  const [ordenacao, definirOrdenacao] = useState('nome')
  const [carregando, definirCarregando] = useState(true)
  const [erro, definirErro] = useState('')
  const [tentativa, definirTentativa] = useState(0)

  const [produtoAdicionando, definirProdutoAdicionando] =
    useState<number | null>(null)

  const [mensagemCarrinho, definirMensagemCarrinho] = useState('')
  const [erroCarrinho, definirErroCarrinho] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregarProdutos() {
      try {
        const produtosEncontrados = await listarProdutos()

        if (ativo) {
          definirProdutos(produtosEncontrados)
        }
      } catch (falha) {
        if (ativo) {
          definirErro(
            falha instanceof Error
              ? falha.message
              : 'Ocorreu um erro ao carregar os produtos.',
          )
        }
      } finally {
        if (ativo) {
          definirCarregando(false)
        }
      }
    }

    carregarProdutos()

    return () => {
      ativo = false
    }
  }, [tentativa])

  function tentarNovamente() {
    definirErro('')
    definirCarregando(true)
    definirTentativa((valorAtual) => valorAtual + 1)
  }

  function limparFiltros() {
    definirBusca('')
    definirCategoria('')
    definirOrdenacao('nome')
  }

  async function adicionarAoCarrinho(produto: Produto) {
    if (!usuario || produtoAdicionando !== null) return

    definirProdutoAdicionando(produto.id)
    definirMensagemCarrinho('')
    definirErroCarrinho('')

    try {
      await adicionarProdutoAoCarrinho(
        usuario.id,
        produto.id,
        1,
      )

      definirMensagemCarrinho(
        `Uma unidade de ${produto.nome} foi adicionada ao carrinho.`,
      )
    } catch (falha) {
      definirErroCarrinho(
        falha instanceof Error
          ? falha.message
          : 'Não foi possível adicionar o produto ao carrinho.',
      )
    } finally {
      definirProdutoAdicionando(null)
    }
  }

  const primeiroNome = usuario?.nome.trim().split(/\s+/)[0]

  const categorias = [
    ...new Set(produtos.map((produto) => produto.categoria)),
  ].sort((primeira, segunda) => {
    return primeira.localeCompare(segunda, 'pt-BR')
  })

  const produtosFiltrados = produtos.filter((produto) => {
    const correspondeBusca = produto.nome
      .toLocaleLowerCase('pt-BR')
      .includes(busca.trim().toLocaleLowerCase('pt-BR'))

    const correspondeCategoria =
      categoria === '' || produto.categoria === categoria

    return correspondeBusca && correspondeCategoria
  })

  const produtosOrdenados = [...produtosFiltrados].sort(
    (primeiroProduto, segundoProduto) => {
      const comparacaoNome = primeiroProduto.nome.localeCompare(
        segundoProduto.nome,
        'pt-BR',
        { sensitivity: 'base' },
      )

      if (ordenacao === 'menor-preco') {
        return (
          primeiroProduto.preco - segundoProduto.preco ||
          comparacaoNome
        )
      }

      if (ordenacao === 'maior-preco') {
        return (
          segundoProduto.preco - primeiroProduto.preco ||
          comparacaoNome
        )
      }

      return comparacaoNome
    },
  )

  return (
    <div className="pagina-produtos">
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
            to="/carrinho"
          >
            Meu carrinho
          </Link>

          <Link
            className="botao botao-secundario"
            to="/pedidos"
          >
            Meus pedidos
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
            disabled={produtoAdicionando !== null}
          >
            Sair
          </button>
        </nav>
      </header>

      <main className="conteudo-produtos">
        <section className="banner-produtos">
          <div>
            <span className="etiqueta-banner">
              ESCOLHAS PARA O SEU DIA
            </span>

            <h1>
              {primeiroNome ? `Olá, ${primeiroNome}!` : 'Boas-vindas!'}
            </h1>

            <p>
              Explore nossos produtos e descubra suas próximas escolhas.
            </p>
          </div>

          <span className="marca-banner" aria-hidden="true">
            m.
          </span>
        </section>

        <section aria-labelledby="titulo-catalogo">
          <div className="titulo-catalogo">
            <span className="etiqueta">
              CONHEÇA NOSSOS PRODUTOS
            </span>

            <h2 id="titulo-catalogo">Nosso catálogo</h2>
          </div>

          <div className="filtros-produtos">
            <div className="campo-filtro">
              <label htmlFor="busca">Buscar produto</label>

              <input
                id="busca"
                type="search"
                placeholder="O que você procura?"
                value={busca}
                onChange={(evento) => {
                  definirBusca(evento.target.value)
                }}
              />
            </div>

            <div className="campo-filtro">
              <label htmlFor="categoria">Categoria</label>

              <select
                id="categoria"
                value={categoria}
                onChange={(evento) => {
                  definirCategoria(evento.target.value)
                }}
              >
                <option value="">Todas as categorias</option>

                {categorias.map((nomeCategoria) => (
                  <option
                    key={nomeCategoria}
                    value={nomeCategoria}
                  >
                    {nomeCategoria}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo-filtro">
              <label htmlFor="ordenacao">Ordenar por</label>

              <select
                id="ordenacao"
                value={ordenacao}
                onChange={(evento) => {
                  definirOrdenacao(evento.target.value)
                }}
              >
                <option value="nome">Nome: A–Z</option>
                <option value="menor-preco">Menor preço</option>
                <option value="maior-preco">Maior preço</option>
              </select>
            </div>
          </div>

          {mensagemCarrinho && (
            <p
              className="mensagem-catalogo mensagem-catalogo-sucesso"
              role="status"
            >
              {mensagemCarrinho}
            </p>
          )}

          {erroCarrinho && (
            <p
              className="mensagem-catalogo mensagem-catalogo-erro"
              role="alert"
            >
              {erroCarrinho}
            </p>
          )}

          {carregando ? (
            <div className="estado-catalogo" role="status">
              <p>Carregando produtos…</p>
            </div>
          ) : erro ? (
            <div className="estado-catalogo">
              <p role="alert">{erro}</p>

              <button
                className="botao botao-principal"
                type="button"
                onClick={tentarNovamente}
              >
                Tentar novamente
              </button>
            </div>
          ) : produtos.length === 0 ? (
            <div className="estado-catalogo">
              <h3>Nosso catálogo está chegando.</h3>
              <p>Ainda não há produtos cadastrados.</p>
            </div>
          ) : (
            <>
              <p className="quantidade-produtos" role="status">
                {produtosOrdenados.length}{' '}
                {produtosOrdenados.length === 1
                  ? 'produto encontrado'
                  : 'produtos encontrados'}
              </p>

              {produtosOrdenados.length === 0 ? (
                <div className="estado-catalogo">
                  <h3>Nenhum produto encontrado.</h3>
                  <p>Experimente outro nome ou categoria.</p>

                  <button
                    className="botao botao-secundario"
                    type="button"
                    onClick={limparFiltros}
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                <div className="grade-produtos">
                  {produtosOrdenados.map((produto) => (
                    <article
                      className="cartao-produto"
                      key={produto.id}
                    >
                      <ImagemProduto produto={produto} />

                      <div className="informacoes-produto">
                        <span className="categoria-produto">
                          {produto.categoria}
                        </span>

                        <h3>{produto.nome}</h3>

                        <p className="preco-produto">
                          {formatoMoeda.format(produto.preco)}
                        </p>

                        <button
                          className="botao botao-principal botao-adicionar"
                          type="button"
                          onClick={() => {
                            adicionarAoCarrinho(produto)
                          }}
                          disabled={produtoAdicionando !== null}
                          aria-label={`Adicionar ${produto.nome} ao carrinho`}
                        >
                          {produtoAdicionando === produto.id
                            ? 'Adicionando…'
                            : 'Adicionar ao carrinho'}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <footer className="rodape">
        <span className="marca-rodape">market.</span>
        <span>Seu mercado, mais perto.</span>
      </footer>
    </div>
  )
}

export default Produtos