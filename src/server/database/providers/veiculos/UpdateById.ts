import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IVeiculo } from '../../models';

export const updateById = async (id: number, veiculo: Omit<IVeiculo, 'id'>): Promise<void | Error> => {
  try {
    const result = await Knex(ETableNames.veiculo)
      .update(veiculo)
      .where('id', '=', id);

    if (result) return;
    return new Error('Erro ao atualizar o registro');
  } catch (error) {
    console.log(error);
    return Error('Erro ao atualizar o registro');
  }

};