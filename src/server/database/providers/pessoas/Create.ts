import { existsTelefone } from './ExistsTelefone';
import { existsCnpjCpf } from './ExistsCnpjCpf';
import { ETableNames } from '../../ETableNames';
import { CidadesProvider } from '../cidades';
import { existsEmail } from './ExistsEmail';
import { IPessoa } from '../../models';
import { Knex } from '../../knex';
import { v4 as uuid } from 'uuid';

export const create = async (pessoa: Omit<IPessoa, 'id'>): Promise<string | Error> => {
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

    if (!await CidadesProvider.existsId(pessoa.cidade_id as string)) {
      return new Error('A cidade informada no cadastro não foi encontrata.');
    }

    const newId = uuid();

    await Knex(ETableNames.pessoa)
      .insert({
        id: newId,
        organizacao_id: pessoa.organizacao_id,
        cnpj_cpf: pessoa.cnpj_cpf,
        nome_razao: pessoa.nome_razao,
        email: pessoa.email,
        telefone: pessoa.telefone,
        ie_rg: pessoa.ie_rg,
        cep: pessoa.cep,
        estado: pessoa.estado,
        cidade_id: pessoa.cidade_id,
        bairro: pessoa.bairro,
        logradouro: pessoa.logradouro,
        numero: pessoa.numero,
        complemento: pessoa.complemento,
        observacoes: pessoa.observacoes
      });

    return newId;

  } catch (error) {
    console.log(error);
    return Error('Erro ao cadastrar o registro');
  }

};