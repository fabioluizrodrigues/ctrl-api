import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export const existsOrgForUsuarioId = async (id: string): Promise<boolean | Error> => {
  try {
    const result = await Knex(ETableNames.organizacao).select('id').where('usuario_adm_id', '=', id).first();
    if (!result) return false;
    return true;
  } catch (error) {
    console.log(error);
    return Error('Erro ao consultar o registro');
  }
};