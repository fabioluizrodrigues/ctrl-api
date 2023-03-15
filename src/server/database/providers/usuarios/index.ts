import * as existsOrgForUsuarioId from './ExistsOrgForUsuarioId';
import * as getOrgIdByUsuarioId from './GetOrgIdByUsuarioId';
import * as existsUsername from './ExistsUsername';
import * as existsCpf from './ExistsCpf';
import * as existsEmail from './ExistsEmail';
import * as existsTelefone from './ExistsTelefone';
import * as getByUsername from './GetByUsername';
import * as existsId from './ExistsId';
import * as getById from './GetById';
import * as create from './Create';

export const UsuariosProvider = {
  ...existsOrgForUsuarioId,
  ...getOrgIdByUsuarioId,
  ...existsUsername,
  ...existsCpf,
  ...existsTelefone,
  ...existsEmail,
  ...getByUsername,
  ...getById,
  ...existsId,
  ...create,
};