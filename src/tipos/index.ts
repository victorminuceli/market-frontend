export interface Usuario {
  id: number
  nome: string
  email: string
}

export interface DadosLogin {
  email: string
  senha: string
}

export interface DadosCadastro extends DadosLogin {
  nome: string
}

export interface DadosAtualizacaoUsuario {
  nome: string
  email: string
  senha?: string
}

export interface Produto {
  id: number
  nome: string
  preco: number
  categoria: string
  imagemUrl?: string | null
}

export interface ItemCarrinho {
  id: number
  produto: Produto
  quantidade: number
}

export interface Carrinho {
  id: number
  itens: ItemCarrinho[]
  total: number
}