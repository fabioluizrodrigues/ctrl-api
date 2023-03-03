import { ICidade, IPessoa, IUsuario } from '../../models';
import { IVeiculo } from '../../models/Veiculo';

declare module 'knex/types/tables' {
  interface Tables {
    cidade: ICidade,
    pessoa: IPessoa,
    usuario: IUsuario
    Veiculo: IVeiculo
  }
}