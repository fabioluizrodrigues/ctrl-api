import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IVeiculo } from '../../models';
import { existsPlaca } from './ExistsPlaca';
import { v4 as uuid } from 'uuid';

export const create = async (veiculo: Omit<IVeiculo, 'id'>): Promise<string | Error> => {
  try {
    if (await existsPlaca(veiculo.placa)) {
      return new Error(`A placa ${veiculo.placa} já consta no cadastro.`);
    }

    const newId = uuid();

    const veiculoInsert: IVeiculo = {} as IVeiculo;

    veiculoInsert.id = newId, 
    veiculoInsert.organizacao_id = veiculo.organizacao_id,
    veiculoInsert.placa = veiculo.placa.trim().toUpperCase(),
    veiculoInsert.renavam = veiculo.renavam,
    veiculoInsert.nr_eixos = veiculo.nr_eixos,
    veiculoInsert.ano_fabrica = veiculo.ano_fabrica,
    veiculoInsert.ano_modelo = veiculo.ano_modelo,
    veiculoInsert.ano_exercicio = veiculo.ano_exercicio,
    veiculoInsert.marca = veiculo.marca,
    veiculoInsert.modelo = veiculo.modelo,
    veiculoInsert.cor = veiculo.cor,
    veiculoInsert.observacoes = veiculo.observacoes;

    await Knex(ETableNames.veiculo).insert(veiculoInsert);

    return newId;

  } catch (error) {
    console.log(error);
    return Error('Erro ao cadastrar o registro');
  }

};