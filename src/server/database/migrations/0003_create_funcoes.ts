import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
  return knex
    .schema
    .createTable(ETableNames.funcao, table => {
      table.uuid('id').primary().index().notNullable();
      table.string('nome', 150).index().notNullable();
      table.string('descricao', 150);
    })
    .then(() => {
      console.log(`# Created table ${ETableNames.funcao}`);
    });
}

export async function down(knex: Knex) {
  return knex
    .schema
    .dropTable(ETableNames.funcao)
    .then(() => {
      console.log(`# Dropped table ${ETableNames.funcao}`);
    });
}