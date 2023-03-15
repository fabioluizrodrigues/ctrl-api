import { ETableNames } from '../../ETableNames';
import { IOrganizacao } from '../../models';
import { Knex } from '../../knex';

export const getById = async (id: string): Promise<IOrganizacao | Error> => {
  try {
    const result = await Knex(ETableNames.organizacao)
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