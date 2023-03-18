import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export const existsCnpjCpf = async (cnpj_cpf: string, excludesId: string[] = []): Promise<boolean | Error> => {
  try {
    const result = await Knex(ETableNames.empresa)
      .select('id')
      .where('cnpj_cpf', '=', cnpj_cpf.trim())
      .whereNotIn('id', excludesId)
      .first();
    if (!result) return false;
    return true;
  } catch (error) {
    console.log(error);
    return Error('Erro ao consultar o registro');
  }
};