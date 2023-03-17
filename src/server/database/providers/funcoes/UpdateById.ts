import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IFuncao } from '../../models';
import { existsId } from './ExistsId';
import { existsNome } from './ExistsNome';

export const updateById = async (id: string, funcao: Omit<IFuncao, 'id'>): Promise<void | Error> => {
  try {
    
    if (!await existsId(id)) {
      return new Error('Registro não encontrado.');
    }    

    if (await existsNome(funcao.nome, [id])) {
      return new Error('O Nome informado já existe no cadastro.');
    }

    const result = await Knex(ETableNames.funcao)
      .update({
        nome: funcao.nome,
        descricao: funcao.descricao
      })
      .where('id', '=', id);

    if (result) return;
    return new Error('Erro ao atualizar o registro');
  } catch (error) {
    console.log(error);
    return Error('Erro ao atualizar o registro');
  }

};