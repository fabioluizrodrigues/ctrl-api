import * as create from './Create';
import * as getByUsername from './GetByUsername';
import * as existsUsername from './ExistsUsername';
import * as getById from './GetById';

export const UsuariosProvider = {
  ...create,
  ...getByUsername,
  ...existsUsername,
  ...getById
};