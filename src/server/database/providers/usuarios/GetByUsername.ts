import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IUsuario } from '../../models';

export const getByUsername = async (username: string): Promise<IUsuario | Error> => {
  try {
    
    const result = await Knex(ETableNames.usuario)
      .select('*')
      .where('username', '=', username)
      .first();

    if (result) return result;

    return new Error('Registro não encontrado');
  } catch (error) {
    console.log(error);
    return Error('Erro ao consultar o registro');
  }

};