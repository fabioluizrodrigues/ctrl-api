import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IUsuario } from '../../models';
import { existsUsername } from './ExistsUsername';

export const create = async (usuario: Omit<IUsuario, 'id'>): Promise<number | Error> => {
  try {

    if (await existsUsername(usuario.username)) {
      return new Error(`O username ${usuario.username} já existe no cadastro.`);
    }

    const [result] = await Knex(ETableNames.usuario).insert(usuario).returning('id');

    if (typeof result === 'object') {
      return result.id;
    } else if (typeof result === 'number') {
      return result;
    }

    return new Error('Erro ao cadastrar o registro');
  } catch (error) {
    console.log(error);
    return Error('Erro ao cadastrar o registro');
  }

};