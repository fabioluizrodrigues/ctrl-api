import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
  return knex
    .schema
    .createTable(ETableNames.organizacao, table => {
      table.uuid('id').primary().index();
      table.string('nome', 200).notNullable();
      table.uuid('usuario_adm_id').references('id').inTable(ETableNames.usuario).index();
      table.string('situacao', 3);
      table.timestamps(true, true);
    })
    .then(() => {
      console.log(`# Created table ${ETableNames.organizacao}`);
    });
}

export async function down(knex: Knex) {
  return knex
    .schema
    .dropTable(ETableNames.organizacao)
    .then(() => {
      console.log(`# Dropped table ${ETableNames.organizacao}`);
    });
}