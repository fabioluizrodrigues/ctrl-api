import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
  return knex
    .schema
    .createTable(ETableNames.controle, table => {
      table.bigIncrements('id').primary().index();
      table.bigInteger('cidade_id')
        .index()
        .nullable()
        .references('id')
        .inTable(ETableNames.usuario)
        .onUpdate('CASCADE')
        .onDelete('RESTRICT');
    })
    .then(() => {
      console.log(`# Created table ${ETableNames.controle}`);
    });
}

export async function down(knex: Knex) {
  return knex
    .schema
    .dropTable(ETableNames.controle)
    .then(() => {
      console.log(`# Dropped table ${ETableNames.controle}`);
    });
}