import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IPessoa } from '../../models';

export const getAll = async (page: number, limit: number, filter: string, id = 0): Promise<IPessoa[] | Error> => {

  try {
    const result = await Knex(ETableNames.pessoa)
      .select('*')
      .where('id', Number(id))
      .orWhere('nome_razao', 'like', `%${filter}%`)
      .offset((page - 1) * limit)
      .limit(limit);

    if (id > 0 && result.every(item => item.id !== id)) {
      const resultById = await Knex(ETableNames.pessoa)
        .select('*')
        .where('id', '=', id)
        .first();

      if (resultById) return [...result, resultById];
    }

    return result;
  } catch (error) {
    console.log(error);
    return Error('Erro ao consultar os registros');
  }
};