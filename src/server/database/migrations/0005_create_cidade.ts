import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
  return knex
    .schema
    .createTable(ETableNames.cidade, table => {
      table.uuid('id').primary().index().notNullable();
      table.string('nome', 150).checkLength('<=', 150).index().notNullable();
      table.string('uf', 2).index();
    })
    .then(() => {
      console.log(`# Created table ${ETableNames.cidade}`);
    });
}

export async function down(knex: Knex) {
  return knex
    .schema
    .dropTable(ETableNames.cidade)
    .then(() => {
      console.log(`# Dropped table ${ETableNames.cidade}`);
    });
}