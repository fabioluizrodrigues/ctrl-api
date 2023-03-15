import * as deleteById from './DeleteById';
import * as updateById from './UpdateById';
import * as existsId from './ExistsId';
import * as existsNome from './ExistsNome';
import * as getById from './GetById';
import * as create from './Create';
import * as getAll from './GetAll';
import * as count from './Count';

export const FuncoesProvider = {
  ...deleteById,
  ...updateById,
  ...existsId,
  ...existsNome,
  ...getById,
  ...create,
  ...getAll,
  ...count,
};