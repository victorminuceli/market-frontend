import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { useSessao } from '../contextos/ContextoSessao'
import { atualizarUsuario, buscarUsuario } from '../servicos/api'
import type { Usuario } from '../tipos'

import '../estilos/perfil.css'

function Perfil() {
  const { usuario, iniciarSessao, encerrarSessao } = useSessao()

  const [perfil, definirPerfil] = useState<Usuario | null>(null)
  const [carregando, definirCarregando] = useState(true)
  const [erro, definirErro] = useState('')
  const [tentativa, definirTentativa] = useState(0)

  const [editando, definirEditando] = useState(false)
  const [salvando, definirSalvando] = useState(false)

  const [nome, definirNome] = useState('')
  const [email, definirEmail] = useState('')
  const [senha, definirSenha] = useState('')
  const [confirmacaoSenha, definirConfirmacaoSenha] = useState('')

  const [erroFormulario, definirErroFormulario] = useState('')
  const [mensagemSucesso, definirMensagemSucesso] = useState('')

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

  function iniciarEdicao() {
    if (!perfil) return

    definirNome(perfil.nome)
    definirEmail(perfil.email)
    definirSenha('')
    definirConfirmacaoSenha('')
    definirErroFormulario('')
    definirMensagemSucesso('')
    definirEditando(true)
  }

  function cancelarEdicao() {
    definirEditando(false)
    definirSenha('')
    definirConfirmacaoSenha('')
    definirErroFormulario('')
  }

  async function salvarAlteracoes(
    evento: FormEvent<HTMLFormElement>,
  ) {
    evento.preventDefault()

    if (!perfil || salvando) return

    definirErroFormulario('')
    definirMensagemSucesso('')

    if (!nome.trim()) {
      definirErroFormulario('Informe seu nome.')
      return
    }

    if (!email.trim()) {
      definirErroFormulario('Informe seu e-mail.')
      return
    }

    if (senha.length > 0) {
      if (!senha.trim()) {
        definirErroFormulario(
          'A nova senha não pode conter somente espaços.',
        )
        return
      }

      if (senha.length < 6) {
        definirErroFormulario(
          'A nova senha precisa ter pelo menos 6 caracteres.',
        )
        return
      }
    }

    if (senha !== confirmacaoSenha) {
      definirErroFormulario('As senhas precisam ser iguais.')
      return
    }

    definirSalvando(true)

    try {
      const usuarioAtualizado = await atualizarUsuario(perfil.id, {
        nome,
        email,
        senha,
      })

      definirPerfil(usuarioAtualizado)
      iniciarSessao(usuarioAtualizado)

      definirSenha('')
      definirConfirmacaoSenha('')
      definirEditando(false)
      definirMensagemSucesso('Perfil atualizado com sucesso!')
    } catch (falha) {
      definirErroFormulario(
        falha instanceof Error
          ? falha.message
          : 'Não foi possível salvar as alterações.',
      )
    } finally {
      definirSalvando(false)
    }
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
            disabled={salvando}
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
          <p>Veja e atualize as informações da sua conta.</p>
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
                {editando ? 'Editar perfil' : 'Informações pessoais'}
              </h2>

              <p className="descricao-perfil">
                {editando
                  ? 'Atualize seus dados abaixo.'
                  : 'Os dados que você informou no cadastro.'}
              </p>

              {mensagemSucesso && (
                <p
                  className="mensagem-perfil mensagem-perfil-sucesso"
                  role="status"
                >
                  {mensagemSucesso}
                </p>
              )}

              {editando ? (
                <form
                  className="formulario-edicao"
                  onSubmit={salvarAlteracoes}
                  aria-busy={salvando}
                >
                  <fieldset disabled={salvando}>
                    <legend className="legenda-edicao">
                      Dados da conta
                    </legend>

                    <div className="campo-edicao">
                      <label htmlFor="nome">Nome completo</label>

                      <input
                        id="nome"
                        name="nome"
                        type="text"
                        autoComplete="name"
                        maxLength={255}
                        value={nome}
                        onChange={(evento) => {
                          definirNome(evento.target.value)
                          definirErroFormulario('')
                        }}
                        required
                      />
                    </div>

                    <div className="campo-edicao">
                      <label htmlFor="email">E-mail</label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        maxLength={255}
                        value={email}
                        onChange={(evento) => {
                          definirEmail(evento.target.value)
                          definirErroFormulario('')
                        }}
                        required
                      />
                    </div>

                    <div className="campo-edicao">
                      <label htmlFor="novaSenha">
                        Nova senha — opcional
                      </label>

                      <input
                        id="novaSenha"
                        name="novaSenha"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Digite uma nova senha"
                        minLength={6}
                        value={senha}
                        aria-describedby="ajuda-senha"
                        onChange={(evento) => {
                          definirSenha(evento.target.value)
                          definirErroFormulario('')
                        }}
                      />

                      <small id="ajuda-senha">
                        Deixe em branco para manter a senha atual.
                        Para trocar, use pelo menos 6 caracteres.
                      </small>
                    </div>

                    <div className="campo-edicao">
                      <label htmlFor="confirmacaoSenha">
                        Confirme a nova senha
                      </label>

                      <input
                        id="confirmacaoSenha"
                        name="confirmacaoSenha"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Repita a nova senha"
                        value={confirmacaoSenha}
                        onChange={(evento) => {
                          definirConfirmacaoSenha(evento.target.value)
                          definirErroFormulario('')
                        }}
                        required={senha.length > 0}
                      />
                    </div>

                    {erroFormulario && (
                      <p
                        className="mensagem-perfil mensagem-perfil-erro"
                        role="alert"
                      >
                        {erroFormulario}
                      </p>
                    )}

                    <div className="acoes-perfil">
                      <button
                        className="botao botao-principal botao-perfil"
                        type="submit"
                      >
                        {salvando ? 'Salvando…' : 'Salvar alterações'}
                      </button>

                      <button
                        className="botao botao-secundario botao-perfil"
                        type="button"
                        onClick={cancelarEdicao}
                      >
                        Cancelar
                      </button>
                    </div>
                  </fieldset>
                </form>
              ) : (
                <>
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

                  <div className="acoes-perfil">
                    <button
                      className="botao botao-principal botao-perfil"
                      type="button"
                      onClick={iniciarEdicao}
                    >
                      Editar perfil
                    </button>

                    <button
                      className="botao botao-secundario botao-perfil"
                      type="button"
                      onClick={encerrarSessao}
                    >
                      Sair da conta
                    </button>
                  </div>
                </>
              )}
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