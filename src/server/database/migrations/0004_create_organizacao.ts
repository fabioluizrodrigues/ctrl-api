import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
  return knex
    .schema
    .createTable(ETableNames.organizacao, table => {
      table.bigIncrements('id').primary().index();
      table.string('nome', 200).notNullable();
      table.bigInteger('usuario_adm_id')
        .index()
        .nullable()
        .references('id')
        .inTable(ETableNames.usuario)
        .onUpdate('CASCADE')
        .onDelete('RESTRICT');
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