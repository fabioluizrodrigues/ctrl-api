import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IOrganizacao } from '../../models';
import { UsuariosProvider } from '../usuarios';

export const create = async (organizacao: Omit<IOrganizacao, 'id'>): Promise<number | Error> => {
  try {
    if (!await UsuariosProvider.existsId(organizacao.usuario_adm_id as number)) {
      return new Error('O usuário informado não foi encontrato.');
    }

    const [result] = await Knex(ETableNames.organizacao)
      .insert({
        nome: organizacao.nome,
        usuario_adm_id: organizacao.usuario_adm_id
      })
      .returning('id');

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