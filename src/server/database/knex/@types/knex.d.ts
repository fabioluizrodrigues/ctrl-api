import {
  ICidade,
  IFuncao,
  IOrganizacao,
  IPermissao,
  IPessoa,
  IUsuario,
  IVeiculo
} from '../../models';


declare module 'knex/types/tables' {
  interface Tables {
    usuario: IUsuario
    organizacao: IOrganizacao
    permissao: IPermissao,
    funcao: IFuncao,
    cidade: ICidade,
    pessoa: IPessoa,
    veiculo: IVeiculo
  }
}