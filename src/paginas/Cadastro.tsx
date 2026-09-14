import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useSessao } from '../contextos/ContextoSessao'
import { cadastrarUsuario } from '../servicos/api'

import '../estilos/acesso.css'

function Cadastro() {
  const [nome, definirNome] = useState('')
  const [email, definirEmail] = useState('')
  const [senha, definirSenha] = useState('')
  const [confirmacaoSenha, definirConfirmacaoSenha] = useState('')
  const [erro, definirErro] = useState('')
  const [carregando, definirCarregando] = useState(false)

  const { iniciarSessao } = useSessao()
  const navegar = useNavigate()

  async function enviarFormulario(
    evento: FormEvent<HTMLFormElement>,
  ) {
    evento.preventDefault()

    if (carregando) return

    definirErro('')

    if (!nome.trim()) {
      definirErro('Informe seu nome.')
      return
    }

    if (senha.length < 6) {
      definirErro('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    if (senha !== confirmacaoSenha) {
      definirErro('As senhas precisam ser iguais.')
      return
    }

    definirCarregando(true)

    try {
      const usuario = await cadastrarUsuario({
        nome,
        email,
        senha,
      })

      iniciarSessao(usuario)

      navegar('/produtos', {
        replace: true,
      })
    } catch (falha) {
      definirErro(
        falha instanceof Error
          ? falha.message
          : 'Não foi possível cadastrar. Tente novamente.',
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

        <Link className="link-entrar" to="/login">
          Já tenho conta
        </Link>
      </header>

      <main className="conteudo-acesso">
        <div className="cartao-acesso">
          <aside className="painel-acesso">
            <span className="etiqueta-acesso">
              SEU MERCADO, MAIS PERTO
            </span>

            <h2>
              Tudo começa
              <br />
              com você.
            </h2>

            <p>
              Crie sua conta e descubra os produtos que fazem parte
              de uma rotina com mais cuidado.
            </p>

            <span className="assinatura-acesso" aria-hidden="true">
              m.
            </span>
          </aside>

          <section
            className="formulario-acesso"
            aria-labelledby="titulo-cadastro"
          >
            <span className="etiqueta">FAÇA PARTE DO MARKET</span>

            <h1 id="titulo-cadastro">Crie sua conta</h1>

            <p className="descricao-acesso">
              Preencha seus dados para começar.
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
                  Dados de cadastro
                </legend>

                <div className="campo-acesso">
                  <label htmlFor="nome">Nome completo</label>

                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    placeholder="Digite seu nome"
                    autoComplete="name"
                    value={nome}
                    onChange={(evento) => {
                      definirNome(evento.target.value)
                      definirErro('')
                    }}
                    required
                  />
                </div>

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
                    }}
                    required
                  />
                </div>

                <div className="campo-acesso">
                  <label htmlFor="senha">
                    Senha — mínimo de 6 caracteres
                  </label>

                  <input
                    id="senha"
                    name="senha"
                    type="password"
                    placeholder="Crie sua senha"
                    autoComplete="new-password"
                    minLength={6}
                    value={senha}
                    onChange={(evento) => {
                      definirSenha(evento.target.value)
                      definirErro('')
                    }}
                    required
                  />
                </div>

                <div className="campo-acesso">
                  <label htmlFor="confirmacaoSenha">
                    Confirme a senha
                  </label>

                  <input
                    id="confirmacaoSenha"
                    name="confirmacaoSenha"
                    type="password"
                    placeholder="Digite a senha novamente"
                    autoComplete="new-password"
                    minLength={6}
                    value={confirmacaoSenha}
                    onChange={(evento) => {
                      definirConfirmacaoSenha(evento.target.value)
                      definirErro('')
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

                <button
                  className="botao botao-principal botao-acesso"
                  type="submit"
                >
                  {carregando ? 'Cadastrando…' : 'Criar conta'}
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

export default Cadastro