import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { v4 as uuid } from 'uuid';
import { IConta } from '../../models';
import { OrganizacoesProvider } from '../oganizacoes';
import { EmpresasProvider } from '../empresas';
import { PessoasProvider } from '../pessoas';

export const create = async (conta: Omit<IConta, 'id'>): Promise<string | Error> => {
  try {
    if (!await OrganizacoesProvider.existsId(conta.organizacao_id)) {
      return new Error('Organização informada não foi encontrata.');
    }

    if (!await EmpresasProvider.existsId(conta.empresa_id)) {
      return new Error('Empresa informada não foi encontrata.');
    }

    if (!await PessoasProvider.existsPessoaId(conta.pessoa_id)) {
      return new Error('Pessoa informada não foi encontrata.');
    }

    const newId = uuid();

    await Knex(ETableNames.conta)
      .insert({
        id: newId,
        organizacao_id: conta.organizacao_id,
        empresa_id: conta.empresa_id,
        pessoa_id: conta.pessoa_id,
        descricao: conta.descricao,
        ativo: true
      });

    return newId;

  } catch (error) {
    console.log(error);
    return Error('Erro ao cadastrar o registro');
  }

};