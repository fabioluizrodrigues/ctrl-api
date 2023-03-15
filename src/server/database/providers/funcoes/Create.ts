import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IFuncao } from '../../models';
import { v4 as uuid } from 'uuid';
import { existsNome } from './ExistsNome';

export const create = async (funcao: Omit<IFuncao, 'id'>): Promise<string | Error> => {
  try {

    if (await existsNome(funcao.nome)) {
      return new Error('O Nome informado já existe no cadastro.');
    }

    const newId = uuid();

    await Knex(ETableNames.funcao)
      .insert({
        id: newId,
        nome: funcao.nome,
        descricao: funcao.descricao
      });

    return newId;
    
  } catch (error) {
    console.log(error);
    return Error('Erro ao cadastrar o registro');
  }

};