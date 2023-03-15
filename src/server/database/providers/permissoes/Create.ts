import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IPermissao } from '../../models';
import { v4 as uuid } from 'uuid';
import { existsNome } from './ExistsNome';

export const create = async (permissao: Omit<IPermissao, 'id'>): Promise<string | Error> => {
  try {

    if (await existsNome(permissao.nome)) {
      return new Error('O Nome informado já existe no cadastro.');
    }

    const newId = uuid();

    await Knex(ETableNames.permissao)
      .insert({
        id: newId,
        nome: permissao.nome,
        descricao: permissao.descricao
      });

    return newId;
    
  } catch (error) {
    console.log(error);
    return Error('Erro ao cadastrar o registro');
  }

};