import * as deleteById from './DeleteById';
import * as updateById from './UpdateById';
import * as existsId from './ExistsId';
import * as getById from './GetById';
import * as create from './Create';
import * as getAll from './GetAll';
import * as count from './Count';

export const CidadesProvider = {
  ...deleteById,
  ...updateById,
  ...existsId,
  ...getById,
  ...create,
  ...getAll,
  ...count,
};