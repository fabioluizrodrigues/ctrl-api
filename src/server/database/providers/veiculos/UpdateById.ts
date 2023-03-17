import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IVeiculo } from '../../models';
import { existsId } from './ExistsId';
import { existsPlaca } from './ExistsPlaca';

export const updateById = async (id: string, veiculo: Omit<IVeiculo, 'id'>): Promise<void | Error> => {
  try {
    if (!await existsId(id)) {
      return new Error('Registro não encontrado.');
    }
    if (await existsPlaca(veiculo.placa, [id])) {
      return new Error(`A placa ${veiculo.placa} já consta no cadastro.`);
    }

    const veiculoUpdate: IVeiculo = {} as IVeiculo;

    veiculoUpdate.placa = veiculo.placa.toUpperCase(),
    veiculoUpdate.renavam = veiculo.renavam,
    veiculoUpdate.nr_eixos = veiculo.nr_eixos,
    veiculoUpdate.ano_fabrica = veiculo.ano_fabrica,
    veiculoUpdate.ano_modelo = veiculo.ano_modelo,
    veiculoUpdate.ano_exercicio = veiculo.ano_exercicio,
    veiculoUpdate.marca = veiculo.marca,
    veiculoUpdate.modelo = veiculo.modelo,
    veiculoUpdate.cor = veiculo.cor,
    veiculoUpdate.observacoes = veiculo.observacoes;

    const result = await Knex(ETableNames.veiculo)
      .update(veiculoUpdate)
      .where('id', '=', id);

    if (result) return;
    return new Error('Erro ao atualizar o registro');
  } catch (error) {
    console.log(error);
    return Error('Erro ao atualizar o registro');
  }

};