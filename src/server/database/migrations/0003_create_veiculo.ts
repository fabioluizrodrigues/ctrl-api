import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
  return knex
    .schema
    .createTable(ETableNames.veiculo, table => {
      table.bigIncrements('id').primary().index();
      table.string('placa', 7).index().unique().notNullable(); 
      table.string('renavam', 20).notNullable(); 
      table.integer('nr_eixos').notNullable();
      table.integer('ano_fabrica').nullable();
      table.integer('ano_modelo').nullable();
      table.integer('ano_exercicio').nullable();
      table.string('marca', 150).nullable();
      table.string('modelo', 150).nullable();
      table.string('cor', 100).nullable();
      table.string('observacoes', 255).nullable();
    })
    .then(() => {
      console.log(`# Created table ${ETableNames.veiculo}`);
    });
}

export async function down(knex: Knex) {
  return knex
    .schema
    .dropTable(ETableNames.veiculo)
    .then(() => {
      console.log(`# Dropped table ${ETableNames.veiculo}`);
    });
}