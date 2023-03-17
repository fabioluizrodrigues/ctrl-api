import { existsTelefone } from './ExistsTelefone';
import { existsCnpjCpf } from './ExistsCnpjCpf';
import { ETableNames } from '../../ETableNames';
import { CidadesProvider } from '../cidades';
import { existsEmail } from './ExistsEmail';
import { IPessoa } from '../../models';
import { Knex } from '../../knex';
import { existsPessoaId } from './ExistsPessoaId';

export const updateById = async (id: string, pessoa: Omit<IPessoa, 'id' | 'organizacao_id'>): Promise<void | Error> => {
  try {
    if (!await existsPessoaId(id)) {
      return new Error('Registro não encontrado.');
    }

    if (await existsCnpjCpf(pessoa.cnpj_cpf, [id])) {
      return new Error('O CNPJ/CPF informado já consta no cadastro.');
    }

    if (await existsEmail(pessoa.email, [id])) {
      return new Error('O email informado já consta no cadastro.');
    }

    if (await existsTelefone(pessoa.telefone, [id])) {
      return new Error('O Telefone informado já consta no cadastro.');
    }

    if ((pessoa.cidade_id) && (pessoa.cidade_id.length > 0)) {
      if (!await CidadesProvider.existsId(pessoa.cidade_id as string)) {
        return new Error('A cidade informada no cadastro não foi encontrata.');
      }
    }

    const pessoaUpdate: IPessoa = {} as IPessoa;

    pessoaUpdate.cnpj_cpf = pessoa.cnpj_cpf;
    pessoaUpdate.nome_razao = pessoa.nome_razao;
    pessoaUpdate.email = pessoa.email;
    pessoaUpdate.telefone = pessoa.telefone;
    pessoaUpdate.ie_rg = pessoa.ie_rg;
    pessoaUpdate.cep = pessoa.cep;
    pessoaUpdate.estado = pessoa.estado;

    if (pessoa.cidade_id) {
      pessoaUpdate.cidade_id = pessoa.cidade_id;
    } else {
      pessoaUpdate.cidade_id = undefined;
    }

    pessoaUpdate.bairro = pessoa.bairro;
    pessoaUpdate.logradouro = pessoa.logradouro;
    pessoaUpdate.numero = pessoa.numero;
    pessoaUpdate.complemento = pessoa.complemento;
    pessoaUpdate.observacoes = pessoa.observacoes;

    const result = await Knex(ETableNames.pessoa).update(pessoaUpdate).where('id', '=', id);

    if (result) return;
    return new Error('Erro ao atualizar o registro');
  } catch (error) {
    console.log(error);
    return Error('Erro ao atualizar o registro');
  }

};