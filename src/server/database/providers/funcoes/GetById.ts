import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IFuncao } from '../../models';

export const getById = async (id: string): Promise<IFuncao | Error> => {
  try {
    const result = await Knex(ETableNames.funcao)
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