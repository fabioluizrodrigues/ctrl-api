import {
  ICidade,
  IConta,
  IEmpresa,
  IFuncao,
  IFuncaoPermissao,
  IOrganizacao,
  IPermissao,
  IPessoa,
  IUsuario,
  IUsuarioFuncao,
  IUsuarioPermissao,
  IVeiculo
} from '../../models';


declare module 'knex/types/tables' {
  interface Tables {
    usuario: IUsuario
    organizacao: IOrganizacao
    empresa: IEmpresa,
    permissao: IPermissao,
    funcao: IFuncao,
    cidade: ICidade,
    pessoa: IPessoa,
    veiculo: IVeiculo,
    usuario_permissao: IUsuarioPermissao,
    usuario_funcao: IUsuarioFuncao,
    funcao_permissao: IFuncaoPermissao,
    conta: IConta,
  }
}