import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IPessoa } from '../../models';

export const updateById = async (id: number, pessoa: Omit<IPessoa, 'id'>): Promise<void | Error> => {
  try {

    const [{ count }] = await Knex(ETableNames.cidade)
      .where('id', '=', pessoa.cidade_id)
      .count<[{ count: number }]>('* as count');

    if (count === 0) {
      return new Error('A cidade informada no cadastro não foi encontrata.');
    }

    const result = await Knex(ETableNames.pessoa)
      .update(pessoa)
      .where('id', '=', id);

    if (result) return;
    return new Error('Erro ao atualizar o registro');
  } catch (error) {
    console.log(error);
    return Error('Erro ao atualizar o registro');
  }

};