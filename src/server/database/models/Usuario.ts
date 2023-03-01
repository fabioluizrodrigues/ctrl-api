export interface IUsuario {
  id: number;
  nome: string;
  username: string;
  password: string;
  pessoa_id?: number;
}

export interface IUsuarioCreate {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  username: string;
  password: string;
}

export interface IUsuarioLogin {
  username: string;
  password: string;
}