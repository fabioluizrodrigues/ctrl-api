import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IVeiculo } from '../../models';

export const getAll = async (page: number, limit: number, filter: string, id = ''): Promise<IVeiculo[] | Error> => {

  try {
    const result = await Knex(ETableNames.veiculo)
      .select('*')
      .where('id','=', id)
      .orWhere('placa', 'like', `%${filter}%`)
      .offset((page - 1) * limit)
      .limit(limit);

    if (id.length > 0 && result.every(item => item.id !== id)) {
      const resultById = await Knex(ETableNames.veiculo)
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