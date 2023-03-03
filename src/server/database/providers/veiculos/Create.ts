import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IVeiculo } from '../../models';

export const create = async (veiculo: Omit<IVeiculo, 'id'>): Promise<number | Error> => {
  try {
    const [result] = await Knex(ETableNames.veiculo).insert(veiculo).returning('id');

    if (typeof result === 'object') {
      return result.id;
    } else if (typeof result === 'number') {
      return result;
    }

    return new Error('Erro ao cadastrar o registro');
  } catch (error) {
    console.log(error);
    return Error('Erro ao cadastrar o registro');
  }

};