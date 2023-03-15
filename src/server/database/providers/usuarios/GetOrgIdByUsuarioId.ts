import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export const getOrgIdByUsuarioId = async (id: string): Promise<string | Error> => {
  try {
    const result = await Knex(ETableNames.organizacao).select('id').where('usuario_adm_id', '=', id).first();
    if (result) return result.id;
    return '';
  } catch (error) {
    console.log(error);
    return Error('Erro ao consultar o registro');
  }

};