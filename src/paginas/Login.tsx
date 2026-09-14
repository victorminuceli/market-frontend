import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { realizarLogin } from '../servicos/api'
import type { Usuario } from '../tipos'
import '../estilos/acesso.css'

function Login() {
  const [email, definirEmail] = useState('')
  const [senha, definirSenha] = useState('')
  const [erro, definirErro] = useState('')
  const [carregando, definirCarregando] = useState(false)
  const [usuario, definirUsuario] = useState<Usuario | null>(null)

  async function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    if (carregando) return

    definirErro('')
    definirUsuario(null)
    definirCarregando(true)

    try {
      const usuarioEncontrado = await realizarLogin({
        email,
        senha,
      })

      definirUsuario(usuarioEncontrado)
      definirSenha('')
    } catch (falha) {
      definirErro(
        falha instanceof Error
          ? falha.message
          : 'Não foi possível entrar. Tente novamente.',
      )
    } finally {
      definirCarregando(false)
    }
  }

  return (
    <div className="pagina-acesso">
      <header className="cabecalho">
        <Link className="marca" to="/" aria-label="Market — início">
          market<span>.</span>
        </Link>

        <Link className="link-entrar" to="/">
          Voltar ao início
        </Link>
      </header>

      <main className="conteudo-acesso">
        <div className="cartao-acesso">
          <aside className="painel-acesso">
            <span className="etiqueta-acesso">
              SEU MERCADO, MAIS PERTO
            </span>

            <h2>
              Que bom ter
              <br />
              você por aqui.
            </h2>

            <p>
              Entre na sua conta e continue descobrindo o que faz parte
              do seu dia.
            </p>

            <span className="assinatura-acesso" aria-hidden="true">
              m.
            </span>
          </aside>

          <section
            className="formulario-acesso"
            aria-labelledby="titulo-login"
          >
            <span className="etiqueta">BEM-VINDO DE VOLTA</span>

            <h1 id="titulo-login">Entre na sua conta</h1>

            <p className="descricao-acesso">
              Informe seu e-mail e sua senha para continuar.
            </p>

            <form
              onSubmit={enviarFormulario}
              aria-busy={carregando}
            >
              <fieldset
                className="campos-acesso"
                disabled={carregando}
              >
                <legend className="somente-leitor">
                  Dados de login
                </legend>

                <div className="campo-acesso">
                  <label htmlFor="email">E-mail</label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="voce@exemplo.com"
                    autoComplete="email"
                    value={email}
                    onChange={(evento) => {
                      definirEmail(evento.target.value)
                      definirErro('')
                      definirUsuario(null)
                    }}
                    required
                  />
                </div>

                <div className="campo-acesso">
                  <label htmlFor="senha">Senha</label>

                  <input
                    id="senha"
                    name="senha"
                    type="password"
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    value={senha}
                    onChange={(evento) => {
                      definirSenha(evento.target.value)
                      definirErro('')
                      definirUsuario(null)
                    }}
                    required
                  />
                </div>

                {erro && (
                  <p
                    className="aviso-acesso aviso-erro"
                    role="alert"
                  >
                    {erro}
                  </p>
                )}

                {usuario && (
                  <p
                    className="aviso-acesso aviso-sucesso"
                    role="status"
                  >
                    Olá, {usuario.nome}! Login realizado com sucesso.
                  </p>
                )}

                <button
                  className="botao botao-principal botao-acesso"
                  type="submit"
                >
                  {carregando ? 'Entrando…' : 'Entrar'}
                </button>
              </fieldset>
            </form>
          </section>
        </div>
      </main>

      <footer className="rodape">
        <span className="marca-rodape">market.</span>
        <span>Seu mercado, mais perto.</span>
      </footer>
    </div>
  )
}

export default Login