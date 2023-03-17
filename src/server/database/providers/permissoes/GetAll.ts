import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IPermissao } from '../../models';

export const getAll = async (page: number, limit: number, filter: string, id = ''): Promise<IPermissao[] | Error> => {

  try {
    const result = await Knex(ETableNames.permissao)
      .select('id', 'nome', 'descricao')
      .where('id', Number(id))
      .orWhere('nome', 'like', `%${filter}%`)
      .offset((page - 1) * limit)
      .limit(limit);

    if (id.length > 0 && result.every(item => item.id !== id)) {
      const resultById = await Knex(ETableNames.permissao)
        .select('id', 'nome')
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