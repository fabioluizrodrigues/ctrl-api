import * as deleteById from './DeleteById';
import * as updateById from './UpdateById';
import * as getById from './GetById';
import * as create from './Create';
import * as getAll from './GetAll';
import * as count from './Count';
import * as existCnpjCpf from './ExistsCnpjCpf';
import * as existsEmail from './ExistsEmail';
import * as existsTelefone from './ExistsTelefone';
import * as existsPessoaId from './ExistsPessoaId';

export const PessoasProvider = {
  ...deleteById,
  ...updateById,
  ...getById,
  ...create,
  ...getAll,
  ...count,
  ...existCnpjCpf,
  ...existsEmail,
  ...existsTelefone,
  ...existsPessoaId
};