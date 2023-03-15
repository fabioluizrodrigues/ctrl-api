import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export const existsCpf = async (cpf: string, excludesId: string[] = []): Promise<boolean | Error> => {
  try {
    const result = await Knex(ETableNames.usuario)
      .select('id')
      .where('cpf', '=', cpf.trim())
      .whereNotIn('id', excludesId)
      .first();
    if (!result) return false;
    return true;
  } catch (error) {
    console.log(error);
    return Error('Erro ao consultar o registro');
  }
};