import { getCities, getStates } from '@brazilian-utils/brazilian-utils';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { ETableNames } from '../ETableNames';
import { ICidade } from '../models';


export const seed = async (knex: Knex) => {
  const [{ count }] = await knex(ETableNames.cidade).count<[{ count: number }]>('* as count');
  if (!Number.isInteger(count) || Number(count) > 0) return;

  const estados = getStates();
  const cidadesInsert: Array<ICidade> = [];

  estados.map((value) => {
    const cidades = getCities(value.code);
    cidades.map((cidade) => {
      cidadesInsert.push({
        id: uuid(),
        nome: cidade,
        uf: value.code
      });
    });
  });

  const chunkSize = 30;
  
  await knex.batchInsert('cidades', cidadesInsert, chunkSize);

};