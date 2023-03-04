import { ETableNames } from '../../ETableNames';
import { UsuariosProvider } from '../usuarios';
import { IOrganizacao } from '../../models';
import { Knex } from '../../knex';

export const updateById = async (id: number, organizacao: Omit<IOrganizacao, 'id'>): Promise<void | Error> => {
  try {
    if (!await UsuariosProvider.existsId(organizacao.usuario_adm_id as number)) {
      return new Error('O usuário informado não foi encontrato.');
    }

    const result = await Knex(ETableNames.organizacao)
      .update({
        nome: organizacao.nome,
        usuario_adm_id: organizacao.usuario_adm_id
      })
      .where('id', '=', id);

    if (result) return;
    return new Error('Erro ao atualizar o registro');
  } catch (error) {
    console.log(error);
    return Error('Erro ao atualizar o registro');
  }

};