import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export const existsEmail = async (email: string, excludesId: number[] = []): Promise<boolean | Error> => {
  try {
    const result = await Knex(ETableNames.pessoa)
      .select('id')
      .where('email', '=', email.trim())
      .whereNotIn('id', excludesId)
      .first();
    if (!result) return false;
    return true;
  } catch (error) {
    console.log(error);
    return Error('Erro ao consultar o registro');
  }

};