import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
  return knex
    .schema
    .createTable(ETableNames.conta, table => {
      table.uuid('id').primary().index().notNullable();

      table.uuid('organizacao_id').references('id').inTable(ETableNames.organizacao).notNullable();

      table.uuid('empresa_id').references('id').inTable(ETableNames.empresa).notNullable();

      table.uuid('pessoa_id').references('id').inTable(ETableNames.pessoa).notNullable();

      table.string('descricao', 255).nullable();

      table.boolean('ativo').defaultTo(true);
    })
    .then(() => {
      console.log(`# Created table ${ETableNames.conta}`);
    });
}

export async function down(knex: Knex) {
  return knex
    .schema
    .dropTable(ETableNames.empresa)
    .then(() => {
      console.log(`# Dropped table ${ETableNames.empresa}`);
    });
}
