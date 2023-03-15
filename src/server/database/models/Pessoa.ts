export interface IPessoa {
  id: string;
  organizacao_id: string;
  cnpj_cpf: string;
  nome_razao: string;
  email: string;
  telefone: string;
  ie_rg?: string;
  cep?: string;
  estado?: string;
  cidade_id?: string;
  bairro?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  observacoes?: string;
}