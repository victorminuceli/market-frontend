import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useSessao } from '../contextos/ContextoSessao'
import { buscarUsuario } from '../servicos/api'
import type { Usuario } from '../tipos'

import '../estilos/perfil.css'

function Perfil() {
  const { usuario, encerrarSessao } = useSessao()

  const [perfil, definirPerfil] = useState<Usuario | null>(null)
  const [carregando, definirCarregando] = useState(true)
  const [erro, definirErro] = useState('')
  const [tentativa, definirTentativa] = useState(0)

  const identificador = usuario?.id

  useEffect(() => {
    if (identificador === undefined) return

    let ativo = true

    async function carregarPerfil(identificadorUsuario: number) {
      try {
        const dados = await buscarUsuario(identificadorUsuario)

        if (ativo) {
          definirPerfil(dados)
        }
      } catch (falha) {
        if (ativo) {
          definirErro(
            falha instanceof Error
              ? falha.message
              : 'Ocorreu um erro ao carregar seu perfil.',
          )
        }
      } finally {
        if (ativo) {
          definirCarregando(false)
        }
      }
    }

    carregarPerfil(identificador)

    return () => {
      ativo = false
    }
  }, [identificador, tentativa])

  function tentarNovamente() {
    definirErro('')
    definirCarregando(true)
    definirTentativa((valorAtual) => valorAtual + 1)
  }

  const inicialNome = perfil?.nome
    .trim()
    .slice(0, 1)
    .toLocaleUpperCase('pt-BR')

  return (
    <div className="pagina-perfil">
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

          <button
            className="botao botao-secundario botao-perfil"
            type="button"
            onClick={encerrarSessao}
          >
            Sair
          </button>
        </nav>
      </header>

      <main className="conteudo-perfil">
        <Link className="voltar-perfil" to="/produtos">
          ← Voltar ao catálogo
        </Link>

        <div className="titulo-perfil">
          <span className="etiqueta">SEU ESPAÇO NO MARKET</span>
          <h1>Meu perfil</h1>
          <p>Veja as informações da sua conta.</p>
        </div>

        {carregando ? (
          <div className="estado-perfil" role="status">
            <p>Carregando seu perfil…</p>
          </div>
        ) : erro ? (
          <div className="estado-perfil">
            <p role="alert">{erro}</p>

            <button
              className="botao botao-principal botao-perfil"
              type="button"
              onClick={tentarNovamente}
            >
              Tentar novamente
            </button>
          </div>
        ) : perfil ? (
          <section
            className="cartao-perfil"
            aria-labelledby="titulo-informacoes"
          >
            <div className="resumo-perfil">
              <span className="avatar-perfil" aria-hidden="true">
                {inicialNome}
              </span>

              <h2>{perfil.nome}</h2>
              <p>Sua conta Market</p>
            </div>

            <div className="dados-perfil">
              <h2 id="titulo-informacoes">
                Informações pessoais
              </h2>

              <p className="descricao-perfil">
                Os dados que você informou no cadastro.
              </p>

              <dl className="lista-dados-perfil">
                <div>
                  <dt>Nome completo</dt>
                  <dd>{perfil.nome}</dd>
                </div>

                <div>
                  <dt>E-mail</dt>
                  <dd>{perfil.email}</dd>
                </div>
              </dl>

              <button
                className="botao botao-secundario botao-perfil"
                type="button"
                onClick={encerrarSessao}
              >
                Sair da conta
              </button>
            </div>
          </section>
        ) : null}
      </main>

      <footer className="rodape">
        <span className="marca-rodape">market.</span>
        <span>Seu mercado, mais perto.</span>
      </footer>
    </div>
  )
}

export default Perfil