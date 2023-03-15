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

    await Knex(ETableNames.veiculo)
      .insert({
        id: newId,
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
      });

    return newId;

  } catch (error) {
    console.log(error);
    return Error('Erro ao cadastrar o registro');
  }

};