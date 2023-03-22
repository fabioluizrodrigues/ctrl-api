
export interface IConta {
  id: string;
  organizacao_id: string;
  empresa_id: string;
  pessoa_id: string;
  descricao?: string;
  ativo?: boolean;
}