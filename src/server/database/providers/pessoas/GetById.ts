import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IPessoa } from '../../models';
import { existsPessoaId } from './ExistsPessoaId';

export const getById = async (id: string): Promise<IPessoa | Error> => {
  try {
    if (!await existsPessoaId(id)) {
      return new Error('Registro não encontrado.');
    }

    const result = await Knex(ETableNames.pessoa)
      .select('*')
      .where('id', '=', id)
      .first();

    if (result) return result;
    return new Error('Registro não encontrado');
  } catch (error) {
    console.log(error);
    return Error('Erro ao consultar o registro');
  }

};