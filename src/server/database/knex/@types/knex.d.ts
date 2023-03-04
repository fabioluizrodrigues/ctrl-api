import {
  ICidade,
  IOrganizacao,
  IPessoa,
  IUsuario,
  IVeiculo
} from '../../models';

declare module 'knex/types/tables' {
  interface Tables {
    cidade: ICidade,
    pessoa: IPessoa,
    usuario: IUsuario
    veiculo: IVeiculo
    organizacao: IOrganizacao
  }
}