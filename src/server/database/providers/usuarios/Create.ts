import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IUsuarioCreate } from '../../models';
import { existsCnpjCpf } from '../pessoas/ExistsCnpjCpf';
import { existsEmail } from '../pessoas/ExistsEmail';
import { existsTelefone } from '../pessoas/ExistsTelefone';
import { existsUsername } from './ExistsUsername';

export const create = async (usuarioCreate: IUsuarioCreate): Promise<number | Error> => {
  try {
    if (await existsCnpjCpf(usuarioCreate.cpf)) {
      return new Error(`O CPF ${usuarioCreate.cpf} já existe no cadastro.`);
    }

    if (await existsEmail(usuarioCreate.email)) {
      return new Error(`O email ${usuarioCreate.email} já consta no cadastro.`);
    }

    if (await existsTelefone(usuarioCreate.telefone)) {
      return new Error(`O Telefone ${usuarioCreate.telefone} já consta no cadastro.`);
    }

    if (await existsUsername(usuarioCreate.username)) {
      return new Error(`O username ${usuarioCreate.username} já existe no cadastro.`);
    }    

    const [resultPessoa] = await Knex(ETableNames.pessoa)
      .insert({
        cnpj_cpf: usuarioCreate.cpf,
        nome_razao: usuarioCreate.nome,
        email: usuarioCreate.email,
        telefone: usuarioCreate.telefone
      })
      .returning('id');

    const [result] = await Knex(ETableNames.usuario)
      .insert({
        nome: usuarioCreate.nome,
        username: usuarioCreate.username,
        password: usuarioCreate.password,
        pessoa_id: resultPessoa.id
      })
      .returning('id');

    if (typeof result === 'object') {
      return result.id;
    } else if (typeof result === 'number') {
      return result;
    }

    return new Error('Erro ao cadastrar o registro');
  } catch (error) {
    console.log(error);
    return Error('Erro ao cadastrar o registro');
  }

};