import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
  return knex
    .schema
    .createTable(ETableNames.usuario, table => {
      table.uuid('id').primary().index();
      table.string('nome', 200).notNullable();
      table.string('cpf', 20).index().unique().notNullable();
      table.string('email', 255).notNullable();
      table.string('telefone', 20).notNullable();
      table.string('username', 100).index().unique().notNullable();
      table.string('password', 100).notNullable();
      table.boolean('ativo').defaultTo(true);
      table.timestamps(true, true);      
    })
    .then(() => {
      console.log(`# Created table ${ETableNames.usuario}`);
    });
}

export async function down(knex: Knex) {
  return knex
    .schema
    .dropTable(ETableNames.usuario)
    .then(() => {
      console.log(`# Dropped table ${ETableNames.usuario}`);
    });
}