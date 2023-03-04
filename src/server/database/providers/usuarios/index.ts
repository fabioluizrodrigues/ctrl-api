import * as existsUsername from './ExistsUsername';
import * as getByUsername from './GetByUsername';
import * as existsId from './ExistsId';
import * as getById from './GetById';
import * as create from './Create';

export const UsuariosProvider = {
  ...existsUsername,
  ...getByUsername,
  ...getById,
  ...existsId,
  ...create,
};