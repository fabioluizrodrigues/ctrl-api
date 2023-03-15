import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export const existsNome = async (nome: string, excludesId: string[] = []): Promise<boolean | Error> => {
  try {
    const result = await Knex(ETableNames.permissao)
      .select('id')
      .where('nome', '=', nome.trim())
      .whereNotIn('id', excludesId)
      .first();
    if (!result) return false;
    return true;
  } catch (error) {
    console.log(error);
    return Error('Erro ao consultar o registro');
  }
};