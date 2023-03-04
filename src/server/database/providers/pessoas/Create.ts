import { existsTelefone } from './ExistsTelefone';
import { existsCnpjCpf } from './ExistsCnpjCpf';
import { ETableNames } from '../../ETableNames';
import { CidadesProvider } from '../cidades';
import { existsEmail } from './ExistsEmail';
import { IPessoa } from '../../models';
import { Knex } from '../../knex';

export const create = async (pessoa: Omit<IPessoa, 'id'>): Promise<number | Error> => {
  try {
    if (await existsCnpjCpf(pessoa.cnpj_cpf)) {
      return new Error('O CNPJ/CPF informado já consta no cadastro.');
    }

    if (await existsEmail(pessoa.email)) {
      return new Error('O email informado já consta no cadastro.');
    }

    if (await existsTelefone(pessoa.telefone)) {
      return new Error('O Telefone informado já consta no cadastro.');
    }

    if (!await CidadesProvider.existsId(pessoa.cidade_id as number)) {
      return new Error('A cidade informada no cadastro não foi encontrata.');
    }

    const [result] = await Knex(ETableNames.pessoa).insert(pessoa).returning('id');

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