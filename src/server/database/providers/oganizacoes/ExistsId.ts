import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export const existsId = async (id: string): Promise<Boolean | Error> => {
  try {
    const result = await Knex(ETableNames.organizacao).select('id').where('id', '=', id).first();
    if (!result) return false;
    return true;
  } catch (error) {
    console.log(error);
    return Error('Erro ao consultar o registro');
  }
};