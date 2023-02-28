import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
  return knex
    .schema
    .createTable(ETableNames.usuario, table => {
      table.bigIncrements('id').primary().index();
      table.string('nome', 200).notNullable();
      table.string('username', 100).index().unique().notNullable().checkLength('>', 3);
      table.string('password', 100).notNullable().checkLength('>=', 4);

      table.bigInteger('pessoa_id')
        .index()
        .nullable()
        .references('id')
        .inTable(ETableNames.pessoa)
        .onUpdate('CASCADE')
        .onDelete('RESTRICT');
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