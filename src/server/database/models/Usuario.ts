export interface IUsuario {
  id: string;
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