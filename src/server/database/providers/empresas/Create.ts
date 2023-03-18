import { existsTelefone } from './ExistsTelefone';
import { existsCnpjCpf } from './ExistsCnpjCpf';
import { ETableNames } from '../../ETableNames';
import { CidadesProvider } from '../cidades';
import { existsEmail } from './ExistsEmail';
import { Knex } from '../../knex';
import { v4 as uuid } from 'uuid'; 
import { OrganizacoesProvider } from '../oganizacoes';
import { IEmpresa } from '../../models';

export const create = async (empresa: Omit<IEmpresa, 'id'>): Promise<string | Error> => {
  try {
    if (await existsCnpjCpf(empresa.cnpj_cpf)) {
      return new Error('O CNPJ/CPF informado já consta no cadastro.');
    }

    if (await existsEmail(empresa.email)) {
      return new Error('O email informado já consta no cadastro.');
    }

    if (await existsTelefone(empresa.telefone)) {
      return new Error('O Telefone informado já consta no cadastro.');
    }
    
    if ((empresa.cidade_id) && (empresa.cidade_id.length > 0)) {
      if (!await CidadesProvider.existsId(empresa.cidade_id as string)) {
        return new Error('A cidade informada não foi encontrata.');
      }
    }

    if (!await OrganizacoesProvider.existsId(empresa.organizacao_id as string)) {
      return new Error('A organização informada não foi encontrata.');
    }

    const newId = uuid();

    const empresaInsert: IEmpresa = {} as IEmpresa;

    empresaInsert.id = newId;
    empresaInsert.organizacao_id = empresa.organizacao_id;
    empresaInsert.cnpj_cpf = empresa.cnpj_cpf;
    empresaInsert.nome_razao = empresa.nome_razao;
    empresaInsert.email = empresa.email;
    empresaInsert.telefone = empresa.telefone;
    empresaInsert.ie_rg = empresa.ie_rg;
    empresaInsert.cep = empresa.cep;
    empresaInsert.estado = empresa.estado;

    if (empresa.cidade_id) {
      empresaInsert.cidade_id = empresa.cidade_id;
    } else {
      empresaInsert.cidade_id = undefined;
    }

    empresaInsert.bairro = empresa.bairro;
    empresaInsert.logradouro = empresa.logradouro;
    empresaInsert.numero = empresa.numero;
    empresaInsert.complemento = empresa.complemento;
    empresaInsert.observacoes = empresa.observacoes;

    await Knex(ETableNames.empresa).insert(empresaInsert);

    return newId;

  } catch (error) {
    console.log(error);
    return Error('Erro ao cadastrar o registro');
  }

};