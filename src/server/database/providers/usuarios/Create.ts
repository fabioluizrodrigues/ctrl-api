import { PasswordCrypto } from '../../../shared/services';
import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IUsuario } from '../../models';
import { existsUsername } from './ExistsUsername';
import { v4 as uuid } from 'uuid';
import { existsCpf } from './ExistsCpf';
import { existsEmail } from './ExistsEmail';
import { existsTelefone } from './ExistsTelefone';

export const create = async (usuarioCreate: IUsuario): Promise<string | Error> => {
  try {
    if (await existsCpf(usuarioCreate.cpf)) {
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

    const hashedPassword = await PasswordCrypto.hashPassword(usuarioCreate.password);

    const newId = uuid();

    await Knex(ETableNames.usuario)
      .insert({
        id: newId,
        nome: usuarioCreate.nome,
        cpf: usuarioCreate.cpf,
        email: usuarioCreate.email,
        telefone: usuarioCreate.telefone,
        username: usuarioCreate.username,
        password: hashedPassword,
      });

    return newId;

    /*     if (typeof result === 'object') {
          return result.id;
        } else if (typeof result === 'number') {
          return result;
        } 

    return new Error('Erro ao cadastrar o registro');*/
  } catch (error) {
    console.log(error);
    return Error('Erro ao cadastrar o registro');
  }

};