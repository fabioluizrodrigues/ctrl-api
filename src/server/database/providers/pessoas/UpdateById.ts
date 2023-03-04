import { existsTelefone } from './ExistsTelefone';
import { existsCnpjCpf } from './ExistsCnpjCpf';
import { ETableNames } from '../../ETableNames';
import { CidadesProvider } from '../cidades';
import { existsEmail } from './ExistsEmail';
import { IPessoa } from '../../models';
import { Knex } from '../../knex';

export const updateById = async (id: number, pessoa: Omit<IPessoa, 'id'>): Promise<void | Error> => {
  try {
    if (await existsCnpjCpf(pessoa.cnpj_cpf, [id])) {
      return new Error('O CNPJ/CPF informado já consta no cadastro.');
    }

    if (await existsEmail(pessoa.email, [id])) {
      return new Error('O email informado já consta no cadastro.');
    }

    if (await existsTelefone(pessoa.telefone, [id])) {
      return new Error('O Telefone informado já consta no cadastro.');
    }

    if (!await CidadesProvider.existsId(pessoa.cidade_id as number)) {
      return new Error('A cidade informada no cadastro não foi encontrata.');
    }

    const result = await Knex(ETableNames.pessoa)
      .update(pessoa)
      .where('id', '=', id);

    if (result) return;
    return new Error('Erro ao atualizar o registro');
  } catch (error) {
    console.log(error);
    return Error('Erro ao atualizar o registro');
  }

};