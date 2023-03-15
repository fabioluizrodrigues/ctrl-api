import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IOrganizacao } from '../../models';

export const updateById = async (id: string, organizacao: Omit<IOrganizacao, 'id' | 'usuario_adm_id'>): Promise<void | Error> => {
  try {
    const result = await Knex(ETableNames.organizacao)
      .update({ nome: organizacao.nome })
      .where('id', '=', id);

    if (result) return;
    return new Error('Erro ao atualizar o registro');
  } catch (error) {
    console.log(error);
    return Error('Erro ao atualizar o registro');
  }

};