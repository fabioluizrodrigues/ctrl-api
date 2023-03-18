import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IEmpresa } from '../../models';
import { CidadesProvider } from '../cidades';
import { existsCnpjCpf } from './ExistsCnpjCpf';
import { existsEmail } from './ExistsEmail';
import { existsId } from './ExistsId';
import { existsTelefone } from './ExistsTelefone';

export const updateById = async (id: string, empresa: Omit<IEmpresa, 'id' | 'organizacao_id'>): Promise<void | Error> => {
  try {
    if (!await existsId(id)) {
      return new Error('Registro não encontrado.');
    }

    if (await existsCnpjCpf(empresa.cnpj_cpf, [id])) {
      return new Error('O CNPJ/CPF informado já consta no cadastro.');
    }

    if (await existsEmail(empresa.email, [id])) {
      return new Error('O email informado já consta no cadastro.');
    }

    if (await existsTelefone(empresa.telefone, [id])) {
      return new Error('O Telefone informado já consta no cadastro.');
    }

    if ((empresa.cidade_id) && (empresa.cidade_id.length > 0)) {
      if (!await CidadesProvider.existsId(empresa.cidade_id as string)) {
        return new Error('A cidade informada no cadastro não foi encontrata.');
      }
    }

    const empresaUpdate: IEmpresa = {} as IEmpresa;

    empresaUpdate.cnpj_cpf = empresa.cnpj_cpf;
    empresaUpdate.nome_razao = empresa.nome_razao;
    empresaUpdate.email = empresa.email;
    empresaUpdate.telefone = empresa.telefone;
    empresaUpdate.ie_rg = empresa.ie_rg;
    empresaUpdate.cep = empresa.cep;
    empresaUpdate.estado = empresa.estado;

    if (empresa.cidade_id) {
      empresaUpdate.cidade_id = empresa.cidade_id;
    } else {
      empresaUpdate.cidade_id = undefined;
    }

    empresaUpdate.bairro = empresa.bairro;
    empresaUpdate.logradouro = empresa.logradouro;
    empresaUpdate.numero = empresa.numero;
    empresaUpdate.complemento = empresa.complemento;
    empresaUpdate.observacoes = empresa.observacoes;

    const result = await Knex(ETableNames.empresa).update(empresaUpdate).where('id', '=', id);

    if (result) return;
    return new Error('Erro ao atualizar o registro');
  } catch (error) {
    console.log(error);
    return Error('Erro ao atualizar o registro');
  }

};