import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export const existsUsername = async (username: string, excludesId: number[] = []): Promise<boolean | Error> => {
  try {

    const result = await Knex(ETableNames.usuario)
      .select('id')
      .where('username', '=', username.trim())
      .whereNotIn('id', excludesId)
      .first();

    if (!result) return false;
    return true;
    
  } catch (error) {
    console.log(error);
    return Error('Erro ao consultar o registro');
  }
};