import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IUsuarioFuncao } from '../../models';
import { EmpresasProvider } from '../empresas';
import { FuncoesProvider } from '../funcoes';
import { OrganizacoesProvider } from '../oganizacoes';
import { UsuariosProvider } from '../usuarios';

export const create = async (usuario_funcao: Omit<IUsuarioFuncao, 'id'>): Promise<void | Error> => {
  try {
    if (!await OrganizacoesProvider.existsId(usuario_funcao.organizacao_id)) {
      return new Error('Organização informada não foi encontrata.');
    }

    if (!await EmpresasProvider.existsId(usuario_funcao.empresa_id)) {
      return new Error('Empresa informada não foi encontrata.');
    }

    if (!await UsuariosProvider.existsId(usuario_funcao.usuario_id)) {
      return new Error('Usuário informado não foi encontrata.');
    }    

    if (!await FuncoesProvider.existsId(usuario_funcao.funcao_id)) {
      return new Error('Função informada não foi encontrata.');
    }

    await Knex(ETableNames.usuario_funcao)
      .insert({
        organizacao_id: usuario_funcao.organizacao_id,
        empresa_id: usuario_funcao.empresa_id,
        usuario_id: usuario_funcao.usuario_id,
        funcao_id: usuario_funcao.funcao_id,
      });

  } catch (error) {
    console.log(error);
    return Error('Erro ao cadastrar o registro');
  }

};