export interface IVeiculo {
  id: number;
  placa: string;
  renavam: string;
  nr_eixos: number;
  ano_fabrica?: number;
  ano_modelo?: number;
  ano_exercicio?: number;
  marca?: string;
  modelo?: string;
  cor?: string;
  observacoes?: string;
}