import { Link } from 'react-router-dom'

function Inicio() {
  return (
    <div className="pagina-inicial">
      <header className="cabecalho">
        <Link className="marca" to="/" aria-label="Market — início">
          market<span>.</span>
        </Link>

        <nav className="navegacao" aria-label="Menu principal">
          <Link className="link-entrar" to="/login">
            Entrar
          </Link>

          <Link className="botao botao-principal" to="/cadastro">
            Criar conta
          </Link>
        </nav>
      </header>

      <main className="conteudo-inicial">
        <section className="apresentacao" aria-labelledby="titulo-inicial">
          <span className="etiqueta">SEU MERCADO, MAIS PERTO</span>

          <h1 id="titulo-inicial">
            O essencial para
            <br />
            o seu dia, com
            <br />
            <span>mais cuidado.</span>
          </h1>

          <p className="descricao">
            Descubra nossos produtos em um só lugar.
            Crie sua conta e comece a explorar o Market.
          </p>

          <div className="acoes-iniciais">
            <Link className="botao botao-principal" to="/cadastro">
              Quero conhecer
              <span aria-hidden="true">↗</span>
            </Link>

            <Link className="botao botao-secundario" to="/login">
              Já tenho conta
            </Link>
          </div>

          <p className="mensagem-apoio">
            Um novo jeito de encontrar o que faz parte da sua rotina.
          </p>
        </section>

        <div className="painel-visual" aria-hidden="true">
          <span className="legenda-painel">SIMPLES. PRÓXIMO. SEU.</span>

          <div className="ilustracao">
            <div className="circulo-decorativo" />
            <div className="folha folha-esquerda" />
            <div className="folha folha-direita" />

            <div className="sacola">
              <div className="alca-sacola" />
              <span className="marca-sacola">market.</span>
              <span className="detalhe-sacola">FEITO PARA O SEU DIA</span>
            </div>
          </div>

          <p className="texto-painel">
            Pequenas escolhas.
            <br />
            <span>Novas possibilidades.</span>
          </p>
        </div>
      </main>

      <footer className="rodape">
        <span className="marca-rodape">market.</span>
        <span>Seu mercado, mais perto.</span>
      </footer>
    </div>
  )
}

export default Inicio