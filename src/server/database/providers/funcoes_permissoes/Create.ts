import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IFuncaoPermissao } from '../../models';
import { EmpresasProvider } from '../empresas';
import { FuncoesProvider } from '../funcoes';
import { OrganizacoesProvider } from '../oganizacoes';
import { PermissoesProvider } from '../permissoes';

export const create = async (funcao_permissao: Omit<IFuncaoPermissao, 'id'>): Promise<void | Error> => {
  try {
    if (!await OrganizacoesProvider.existsId(funcao_permissao.organizacao_id)) {
      return new Error('Organização informada não foi encontrata.');
    }

    if (!await EmpresasProvider.existsId(funcao_permissao.empresa_id)) {
      return new Error('Empresa informada não foi encontrata.');
    }

    if (!await FuncoesProvider.existsId(funcao_permissao.funcao_id)) {
      return new Error('Função informada não foi encontrata.');
    }

    if (!await PermissoesProvider.existsId(funcao_permissao.permissao_id)) {
      return new Error('Permissão informada não foi encontrata.');
    }

    await Knex(ETableNames.funcao_permissao)
      .insert({
        organizacao_id: funcao_permissao.organizacao_id,
        empresa_id: funcao_permissao.empresa_id,
        funcao_id: funcao_permissao.funcao_id,
        permissao_id: funcao_permissao.permissao_id
      });

  } catch (error) {
    console.log(error);
    return Error('Erro ao cadastrar o registro');
  }

};