import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { existsId } from './ExistsId';

export const deleteById = async (id: string): Promise<void | Error> => {
  try {
    if (!await existsId(id)) {
      return new Error('Registro não encontrado.');
    }
    const result = await Knex(ETableNames.veiculo).where('id', '=', id).del();
    if (result > 0) return;
    return new Error('Erro ao apagar o registro');
  } catch (error) {
    console.log(error);
    return Error('Erro ao apagar o registro');
  }

};