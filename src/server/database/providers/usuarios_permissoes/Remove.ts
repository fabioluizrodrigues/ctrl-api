import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IUsuarioPermissao } from '../../models';
import { EmpresasProvider } from '../empresas';
import { OrganizacoesProvider } from '../oganizacoes';
import { PermissoesProvider } from '../permissoes';
import { UsuariosProvider } from '../usuarios';

export const remove = async (usuario_permissao: Omit<IUsuarioPermissao, 'id'>): Promise<void | Error> => {
  try {
    if (!await OrganizacoesProvider.existsId(usuario_permissao.organizacao_id)) {
      return new Error('Organização informada não foi encontrata.');
    }

    if (!await EmpresasProvider.existsId(usuario_permissao.empresa_id)) {
      return new Error('Empresa informada não foi encontrata.');
    }

    if (!await UsuariosProvider.existsId(usuario_permissao.usuario_id)) {
      return new Error('Usuário informado não foi encontrata.');
    }    

    if (!await PermissoesProvider.existsId(usuario_permissao.permissao_id)) {
      return new Error('Permissão informada não foi encontrata.');
    }

    await Knex(ETableNames.usuario_permissao)
      .where('organizacao_id', '=', usuario_permissao.organizacao_id)
      .where('empresa_id', '=', usuario_permissao.empresa_id)
      .where('usuario_id', '=', usuario_permissao.usuario_id)
      .where('permissao_id', '=', usuario_permissao.permissao_id)
      .del();

  } catch (error) {
    console.log(error);
    return Error('Erro ao remover o registro');
  }

};