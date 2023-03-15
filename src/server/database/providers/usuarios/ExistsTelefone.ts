import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export const existsTelefone = async (telefone: string, excludesId: string[] = []): Promise<Boolean | Error> => {
  try {
    const result = await Knex(ETableNames.usuario)
      .select('id')
      .where('telefone', '=', telefone.trim())
      .whereNotIn('id', excludesId)
      .first();
    if (!result) return false;
    return true;
  } catch (error) {
    console.log(error);
    return Error('Erro ao consultar o registro');
  }
};