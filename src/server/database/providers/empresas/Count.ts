import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export const count = async (filter = ''): Promise<number | Error> => {

  try {
    const [{ count }] = await Knex(ETableNames.empresa)
      .where('nome_razao', 'like', `%${filter}%`)
      .count<[{ count: number }]>('* as count');

    if (Number.isInteger(Number(count))) return Number(count);

    return Error('Erro ao consultar a quantidade total de registros');
  } catch (error) {
    console.log(error);
    return Error('Erro ao consultar a quantidade total de registros');
  }
};