import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export const existsPlaca = async (placa: string, excludesId: number[] = []): Promise<boolean | Error> => {
  try {
    const result = await Knex(ETableNames.veiculo)
      .select('id')
      .where('placa', '=', placa.trim().toUpperCase())
      .whereNotIn('id', excludesId)
      .first();
    if (!result) return false;
    return true;
  } catch (error) {
    console.log(error);
    return Error('Erro ao consultar o registro');
  }
};