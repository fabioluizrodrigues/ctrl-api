import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IVeiculo } from '../../models';
import { existsPlaca } from './ExistsPlaca';

export const updateById = async (id: string, veiculo: Omit<IVeiculo, 'id'>): Promise<void | Error> => {
  try {
    if (await existsPlaca(veiculo.placa, [id])) {
      return new Error(`A placa ${veiculo.placa} já consta no cadastro.`);
    }

    const result = await Knex(ETableNames.veiculo)
      .update({
        placa: veiculo.placa.toUpperCase(),
        renavam: veiculo.renavam,
        nr_eixos: veiculo.nr_eixos,
        ano_fabrica: veiculo.ano_fabrica,
        ano_modelo: veiculo.ano_modelo,
        ano_exercicio: veiculo.ano_exercicio,
        marca: veiculo.marca,
        modelo: veiculo.modelo,
        cor: veiculo.cor,
        observacoes: veiculo.observacoes
      })
      .where('id', '=', id);

    if (result) return;
    return new Error('Erro ao atualizar o registro');
  } catch (error) {
    console.log(error);
    return Error('Erro ao atualizar o registro');
  }

};