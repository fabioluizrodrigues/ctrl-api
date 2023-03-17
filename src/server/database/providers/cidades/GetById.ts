import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { ICidade } from '../../models';
import { existsId } from './ExistsId';

export const getById = async (id: string): Promise<ICidade | Error> => {
  try {
    if (!await existsId(id)) {
      return new Error('Registro não encontrado.');
    }
    const result = await Knex(ETableNames.cidade)
      .select('id', 'nome')
      .where('id', '=', id)
      .first();

    if (result) return result;
    return new Error('Registro não encontrado');
  } catch (error) {
    console.log(error);
    return Error('Erro ao consultar o registro');
  }

};