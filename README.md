# Market

Aplicação web de mercado. O cliente pode criar uma conta, consultar produtos, montar um carrinho e finalizar compras, consultando seus pedidos depois.

O projeto integra um frontend em React e TypeScript, uma API em Java com Spring Boot e um banco MySQL. A execução é local.

## Repositórios

- [Frontend](https://github.com/victorminuceli/market-frontend)
- [Backend](https://github.com/victorminuceli/Market_java)

É necessário baixar os dois repositórios para executar o sistema completo.

## Funcionalidades

### Conta do usuário

- Cadastro e login.
- Consulta e atualização do perfil.
- Alteração opcional da senha.
- Exclusão da conta, incluindo seu carrinho e histórico de pedidos.
- Encerramento da sessão pelo botão Sair.

### Catálogo

- Listagem de produtos cadastrados no MySQL.
- Exibição de nome, categoria, preço e imagem.
- Busca por nome e filtro por categoria.
- Ordenação por nome, menor preço e maior preço.
- Imagem alternativa quando a foto não está disponível.

### Carrinho

- Adição de produtos.
- Aumento e redução das quantidades.
- Remoção de itens.
- Cálculo dos subtotais e do total.
- Persistência dos itens no banco de dados.

### Pedidos

- Finalização da compra a partir do carrinho.
- Registro de produtos, quantidades e preços da compra.
- Esvaziamento do carrinho após a finalização.
- Consulta do histórico e dos itens de cada pedido.

O catálogo é preparado automaticamente pelo backend a partir do arquivo `data.sql`. A interface atual é voltada ao cliente e não possui painel de funcionários nem gerenciamento de produtos.

Finalizar uma compra registra um pedido; não existe integração com pagamento ou entrega.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend | React 19, TypeScript 6, Vite 8, React Router e CSS |
| Comunicação | Fetch API e proxy de desenvolvimento do Vite |
| Backend | Java 17, Spring Boot 4.1.1 e Spring Web MVC |
| Persistência | Spring Data JPA, Hibernate e MySQL 8 |
| Validação | Jakarta Validation |
| Apoio ao backend | Lombok e Gradle Wrapper |
| Verificação do frontend | ESLint e compilador TypeScript |
| Versionamento | Git e GitHub |

## Identidade visual

| Cor | Código |
| --- | --- |
| Marrom escuro | #442D1C |
| Terracota | #743014 |
| Marrom dourado | #84592B |
| Verde oliva | #9D9167 |

## Como as partes se conectam

```text
Navegador → React/Vite → API Spring Boot → MySQL
              5173            8080          3306
```

O frontend envia requisições para `/api`. Durante o desenvolvimento, o Vite encaminha essas requisições para `http://localhost:8080` e remove o prefixo `/api`.

Exemplo:

```text
/api/produtos
```

no frontend chega ao backend como:

```text
/produtos
```

## Pré-requisitos

Instale na máquina:

- Git.
- JDK 17.
- Node.js 22.12 ou superior, com npm. O Vite também aceita Node 20.19 ou superior da linha 20.
- MySQL Server 8 e MySQL Workbench.
- IntelliJ IDEA para trabalhar no backend e VS Code para o frontend.

O MySQL Server é o serviço que mantém o banco. O Workbench é a ferramenta usada para consultar e administrar esse banco.

Não é necessário instalar Gradle separadamente: o backend inclui o Gradle Wrapper.

Os comandos abaixo usam Windows PowerShell. Após instalar Node ou Java, reabra os terminais para carregar o PATH atualizado.

Confira as instalações:

```powershell
git --version
java -version
node --version
npm.cmd --version
```

## 1. Baixar os projetos

Abra um terminal na pasta onde deseja guardar os projetos e execute:

```powershell
git clone https://github.com/victorminuceli/Market_java.git
git clone https://github.com/victorminuceli/market-frontend.git
```

A organização será:

```text
pasta-escolhida/
├── Market_java/
│   └── market/            # Projeto Gradle do backend
└── market-frontend/       # Projeto React
```

Nos próximos passos, os caminhos são relativos a essa pasta escolhida. Ao usar outro computador, não copie caminhos pessoais de uma instalação anterior.

## 2. Criar o banco de dados

Inicie o MySQL Server.

No MySQL Workbench, conecte-se à instância local e execute:

```sql
CREATE DATABASE IF NOT EXISTS market
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
```

O backend está configurado para acessar:

- Servidor: `localhost`
- Porta: `3306`
- Banco: `market`
- Usuário: `root`

Se sua instalação utiliza outro usuário ou porta, ajuste o arquivo:

```text
Market_java/market/src/main/resources/application.properties
```

### Criação das tabelas e carga dos produtos

Não é necessário criar as tabelas manualmente.

Ao iniciar o backend:

1. O Hibernate cria ou atualiza as tabelas do sistema.
2. O Spring executa automaticamente o arquivo `src/main/resources/data.sql`.
3. Os produtos iniciais são inseridos no banco.

Portanto, em uma instalação nova, basta criar o banco `market` e executar o backend.

## 3. Configurar e executar o backend

### Pelo IntelliJ IDEA

1. Abra a pasta:

```text
Market_java/market
```
como projeto no IntelliJ IDEA.

2. Aguarde o IntelliJ importar o Gradle e baixar as dependências.

3. Confirme que o projeto está utilizando **Java 17**.

4. Abra:

```text
src/main/java/com/example/market/MarketApplication.java
```

5. Clique no botão ▶ ao lado do método `main` e execute `MarketApplication`.

6. Na primeira execução, o IntelliJ poderá criar automaticamente uma configuração para a aplicação.

7. Abra **Run → Edit Configurations** e, na configuração `MarketApplication`, configure a variável de ambiente:

```text
DB_PASSWORD=SUA_SENHA_DO_MYSQL
```

Substitua `SUA_SENHA_DO_MYSQL` pela senha real do MySQL.

> A senha não deve ser colocada diretamente no `application.properties` nem enviada para o GitHub.

> **Exemplo:** uma imagem da configuração do backend no IntelliJ está disponível no repositório [Market_java](https://github.com/victorminuceli/Market_java), na pasta `docs`: [ver imagem](https://github.com/victorminuceli/Market_java/blob/main/market/docs/intellij-config.png).

8. Execute novamente `MarketApplication`.

Se algum campo estiver oculto, procure-o em **Modify options**.

### Pelo PowerShell

Como alternativa ao IntelliJ, abra o PowerShell na pasta do backend:

```powershell
cd .\Market_java\market
```

Configure a senha do MySQL para esse terminal:

```powershell
$env:DB_PASSWORD = 'SUA_SENHA_DO_MYSQL'
```

Depois execute:

```powershell
.\gradlew.bat bootRun
```

A variável `DB_PASSWORD` vale somente para esse terminal.

Use apenas uma forma de execução por vez para evitar conflito na porta `8080`.

### Inicialização automática do banco

Na primeira inicialização, o Hibernate cria ou atualiza as tabelas porque o projeto utiliza:

```properties
spring.jpa.hibernate.ddl-auto=update
```

Depois disso, o Spring executa automaticamente o:

```text
src/main/resources/data.sql
```

O arquivo contém os produtos iniciais do catálogo.

As configurações responsáveis pela execução são:

```properties
spring.jpa.defer-datasource-initialization=true
spring.sql.init.mode=always
```

Uma inicialização bem-sucedida mostra mensagens semelhantes a:

```text
Tomcat started on port 8080
Started MarketApplication
```

Teste a API em:

```text
http://localhost:8080/produtos
```

Em um banco novo, a resposta deve conter os produtos carregados pelo `data.sql`.

### Sobre o `data.sql`

O `data.sql` utiliza `INSERT IGNORE` para evitar erros de chave duplicada quando o backend é iniciado novamente.

Isso significa que:

- na primeira execução, os produtos são inseridos;
- nas execuções seguintes, produtos que já existem são ignorados;
- se um dos produtos iniciais for excluído do banco e o backend for reiniciado, ele poderá ser inserido novamente pelo `data.sql`.

Esse comportamento é intencional para manter a carga inicial do catálogo automatizada.

Atualmente, o CRUD de produtos não é disponibilizado no frontend, pois o usuário do sistema é tratado como cliente do supermercado. Futuramente, caso necessário, o sistema poderá separar os perfis de cliente e funcionário, permitindo o gerenciamento de produtos por funcionários.

## 4. Executar o frontend

Com o backend em execução, abra outro terminal na pasta escolhida para os clones:

```powershell
cd .\market-frontend
```

Na primeira instalação, instale as dependências:

```powershell
npm.cmd ci
```

Depois inicie o frontend:

```powershell
npm.cmd run dev
```

Abra:

```text
http://localhost:5173
```

O frontend utiliza o proxy do Vite para encaminhar as requisições `/api` ao backend em `http://localhost:8080`.

Mantenha o MySQL, o backend e o Vite em execução.

Para o uso cotidiano, basta:

1. iniciar o MySQL;
2. iniciar o backend;
3. iniciar o frontend.

Não é necessário executar nenhum SQL manualmente para carregar os produtos.

## 5. Entender as imagens

As fotos ficam no repositório do backend:

```text
Market_java/market/uploads/produtos/
```

No banco, o campo `imagem_url` guarda um endereço como:

```text
/imagens/produtos/cafe.jpg
```

O backend mapeia esse endereço para o arquivo físico em:

```text
uploads/produtos/
```

Portanto, a pasta física e o endereço público têm nomes diferentes por configuração.

Teste uma foto em:

```text
http://localhost:8080/imagens/produtos/cafe.jpg
```

As imagens versionadas são baixadas junto com o clone.

O SQL guarda os caminhos das imagens, não os arquivos das fotos. Não há upload de imagens pela interface atual.

## Roteiro de teste manual

Com MySQL, backend e frontend em execução:

1. Cadastre uma conta pela interface.
2. Saia e faça login.
3. Acesse o perfil e atualize seus dados.
4. Consulte o catálogo e teste busca, categoria e ordenação.
5. Adicione produtos ao carrinho.
6. Altere quantidades e confira os totais.
7. Atualize a página e confira se os itens continuam salvos.
8. Finalize a compra.
9. Abra **Meus pedidos** e confira os itens e o valor total.
10. Volte ao carrinho e confira se ficou vazio.

A exclusão de conta pode ser testada com uma conta de teste: ela também exclui o carrinho e o histórico dessa conta.

### Conferir no MySQL

#### Contas cadastradas

```sql
SELECT id, nome, email
FROM market.usuarios;
```

#### Produtos

```sql
SELECT id, nome, categoria, preco, imagem_url
FROM market.produtos
ORDER BY id;
```

#### Pedidos e seus usuários

```sql
SELECT p.id, p.usuario_id, p.data, p.status, p.valor_total
FROM market.pedidos p
ORDER BY p.id DESC;
```

#### Itens e preços registrados na compra

```sql
SELECT i.pedido_id, pr.nome, i.quantidade, i.preco,
       i.quantidade * i.preco AS subtotal
FROM market.itens_pedido i
JOIN market.produtos pr ON pr.id = i.produto_id
ORDER BY i.pedido_id DESC, i.id;
```

## Verificar e compilar o frontend

Na pasta `market-frontend`, execute:

```powershell
npm.cmd run lint
npm.cmd run build
```

- `lint`: verifica regras de qualidade e uso dos hooks.
- `build`: verifica os tipos e gera os arquivos estáticos na pasta `dist`.
- `dev`: inicia o ambiente local usado neste guia, com o proxy da API.
- `preview`: permite visualizar o build localmente; não é um servidor de produção.

Passar no lint e no build não substitui os testes manuais de integração.

Para publicar o frontend futuramente, será necessário configurar o encaminhamento de `/api` no ambiente de hospedagem. Gerar `dist` não executa o backend nem o banco.

## Organização das pastas

### Frontend

```text
src/
├── assets/       # Recursos visuais do frontend
├── contextos/    # Contexto e provedor da sessão
├── estilos/      # CSS das páginas
├── paginas/      # Páginas da aplicação
├── servicos/     # Comunicação com a API
├── tipos/        # Interfaces e tipos TypeScript
├── App.tsx       # Rotas da aplicação
└── main.tsx      # Inicialização do React
```

### Backend

```text
market/
├── banco/
│   └── produtos.sql          # Script manual/backup do catálogo
├── docs/
│   └── intellij-config.png   # Exemplo de configuração do IntelliJ
├── uploads/
│   └── produtos/             # Imagens dos produtos
├── src/main/
│   ├── java/com/example/market/
│   │   ├── config/           # Configuração do acesso às imagens
│   │   ├── controller/       # Rotas HTTP
│   │   ├── dto/              # Dados recebidos em operações específicas
│   │   ├── model/entity/     # Entidades persistidas
│   │   ├── repository/       # Acesso ao banco
│   │   ├── service/          # Regras de negócio
│   │   └── MarketApplication.java
│   └── resources/
│       ├── application.properties
│       └── data.sql          # Carga automática dos produtos
├── build.gradle
└── gradlew.bat
```

## Problemas comuns

| Situação | O que conferir |
| --- | --- |
| `npm.cmd` não reconhecido | Confira a instalação do Node e reabra o terminal. |
| Java não encontrado | Configure JDK 17 e, no terminal, `JAVA_HOME`/`PATH`. |
| Acesso negado ao MySQL | Confira usuário, senha e a variável `DB_PASSWORD` do processo que executa o backend. |
| Falha de conexão ao banco | Confira se o MySQL Server está iniciado na porta configurada. |
| Banco `market` não existe | Execute o SQL da seção **2. Criar o banco de dados**. |
| Porta 8080 ocupada | Verifique se outra execução do backend já está aberta. |
| Porta 5173 ocupada | Use o Vite já aberto ou encerre a execução anterior. |
| Catálogo retorna `[]` | Confira se o backend iniciou corretamente e se o `data.sql` está em `src/main/resources`. |
| Produtos não aparecem após iniciar o backend | Confira o banco `market` com `SELECT COUNT(*) FROM market.produtos;`. |
| Imagem retorna 404 | Confira nome e extensão do arquivo, `imagem_url` e o diretório de trabalho do backend. |
| Página de erro na raiz da porta 8080 | A interface fica na porta 5173. Teste a API pelo endpoint `/produtos`. |
| Finalização sem confirmação | Consulte o histórico antes de repetir a compra, pois o pedido pode ter sido salvo. |

## Escopo acadêmico

O projeto foi desenvolvido para demonstração local das quatro funcionalidades principais.

O controle de sessão do frontend não equivale a autenticação e autorização de uma aplicação de produção.

Melhorias de segurança, como hash de senhas e autorização no backend, fazem parte de uma evolução futura.

A interface atual representa o perfil de cliente. O gerenciamento de produtos por funcionários não faz parte do escopo atual, mas a aplicação pode ser evoluída futuramente para separar os perfis de cliente e funcionário.

Não inclua senhas reais em arquivos versionados ou nas configurações compartilhadas do IntelliJ.
