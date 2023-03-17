import { existsTelefone } from './ExistsTelefone';
import { existsCnpjCpf } from './ExistsCnpjCpf';
import { ETableNames } from '../../ETableNames';
import { CidadesProvider } from '../cidades';
import { existsEmail } from './ExistsEmail';
import { IPessoa } from '../../models';
import { Knex } from '../../knex';
import { v4 as uuid } from 'uuid'; 
import { OrganizacoesProvider } from '../oganizacoes';

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
    
    if ((pessoa.cidade_id) && (pessoa.cidade_id.length > 0)) {
      if (!await CidadesProvider.existsId(pessoa.cidade_id as string)) {
        return new Error('A cidade informada não foi encontrata.');
      }
    }

    if (!await OrganizacoesProvider.existsId(pessoa.organizacao_id as string)) {
      return new Error('A organização informada no cadastro não foi encontrata.');
    }

    const newId = uuid();

    const pessoaInsert: IPessoa = {} as IPessoa;

    pessoaInsert.id = newId;
    pessoaInsert.organizacao_id = pessoa.organizacao_id;
    pessoaInsert.cnpj_cpf = pessoa.cnpj_cpf;
    pessoaInsert.nome_razao = pessoa.nome_razao;
    pessoaInsert.email = pessoa.email;
    pessoaInsert.telefone = pessoa.telefone;
    pessoaInsert.ie_rg = pessoa.ie_rg;
    pessoaInsert.cep = pessoa.cep;
    pessoaInsert.estado = pessoa.estado;

    if (pessoa.cidade_id) {
      pessoaInsert.cidade_id = pessoa.cidade_id;
    } else {
      pessoaInsert.cidade_id = undefined;
    }

    pessoaInsert.bairro = pessoa.bairro;
    pessoaInsert.logradouro = pessoa.logradouro;
    pessoaInsert.numero = pessoa.numero;
    pessoaInsert.complemento = pessoa.complemento;
    pessoaInsert.observacoes = pessoa.observacoes;

    await Knex(ETableNames.pessoa).insert(pessoaInsert);

    return newId;

  } catch (error) {
    console.log(error);
    return Error('Erro ao cadastrar o registro');
  }

};