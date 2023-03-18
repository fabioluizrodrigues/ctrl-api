import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { ICidade } from '../../models';
import { v4 as uuid } from 'uuid';

export const create = async (cidade: Omit<ICidade, 'id'>): Promise<string | Error> => {
  try {

    const newId = uuid();

    await Knex(ETableNames.cidade)
      .insert({
        id: newId,
        nome: cidade.nome,
        uf: cidade.uf
      });

    return newId;
    
  } catch (error) {
    console.log(error);
    return Error('Erro ao cadastrar o registro');
  }

};