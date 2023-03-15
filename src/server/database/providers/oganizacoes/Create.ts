import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IOrganizacao } from '../../models';
import { UsuariosProvider } from '../usuarios';
import { v4 as uuid } from 'uuid';

export const create = async (organizacao: Omit<IOrganizacao, 'id'>): Promise<string | Error> => {
  try {
    if (!await UsuariosProvider.existsId(organizacao.usuario_adm_id)) {
      return new Error('O usuário informado não foi encontrato.');
    }

    //não deixa criar mais de uma organização por usuário
    if (await UsuariosProvider.existsOrgForUsuarioId(organizacao.usuario_adm_id)) {
      return new Error('Não é permitido criar mais de uma organização para o mesmo usuário.');
    }

    const newId = uuid();

    await Knex(ETableNames.organizacao)
      .insert({
        id: newId,
        nome: organizacao.nome,
        usuario_adm_id: organizacao.usuario_adm_id
      });

    return newId;

  } catch (error) {
    console.log(error);
    return Error('Erro ao cadastrar o registro');
  }

};