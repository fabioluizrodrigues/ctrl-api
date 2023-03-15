import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IPermissao } from '../../models';
import { existsNome } from './ExistsNome';

export const updateById = async (id: string, permissao: Omit<IPermissao, 'id'>): Promise<void | Error> => {
  try {
    
    if (await existsNome(permissao.nome, [id])) {
      return new Error('O Nome informado já existe no cadastro.');
    }

    const result = await Knex(ETableNames.permissao)
      .update({
        nome: permissao.nome,
        descricao: permissao.descricao
      })
      .where('id', '=', id);

    if (result) return;
    return new Error('Erro ao atualizar o registro');
  } catch (error) {
    console.log(error);
    return Error('Erro ao atualizar o registro');
  }

};