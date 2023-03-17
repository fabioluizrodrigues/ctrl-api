import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IFuncao } from '../../models';
import { existsId } from './ExistsId';

export const getById = async (id: string): Promise<IFuncao | Error> => {
  if (!await existsId(id)) {
    return new Error('Registro não encontrado.');
  }

  try {
    const result = await Knex(ETableNames.funcao)
      .select('id', 'nome', 'descricao')
      .where('id', '=', id)
      .first();

    if (result) return result;
    return new Error('Registro não encontrado');
  } catch (error) {
    console.log(error);
    return Error('Erro ao consultar o registro');
  }

};