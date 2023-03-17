import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { ICidade } from '../../models';
import { existsId } from './ExistsId';

export const updateById = async (id: string, cidade: Omit<ICidade, 'id'>): Promise<void | Error> => {
  try {
    if (!await existsId(id)) {
      return new Error('Registro não encontrado.');
    }
    const result = await Knex(ETableNames.cidade)
      .update({
        nome: cidade.nome
      })
      .where('id', '=', id);

    if (result) return;
    return new Error('Erro ao atualizar o registro');
  } catch (error) {
    console.log(error);
    return Error('Erro ao atualizar o registro');
  }

};