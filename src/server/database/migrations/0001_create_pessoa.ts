import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
  return knex
    .schema
    .createTable(ETableNames.pessoa, table => {
      table.bigIncrements('id').primary().index();
      table.string('cnpj_cpf', 20).index().unique().notNullable(); //19092935000173
      table.string('nome_razao', 255).index().notNullable();
      table.string('email', 255).unique().notNullable();
      table.string('telefone', 20).unique().notNullable(); 

      table.string('ie_rg', 20).nullable();
      table.string('cep', 8).nullable(); //78840000
      table.string('estado', 2).nullable().checkLength('<=', 2);

      table.bigInteger('cidade_id')
        .index()
        .nullable()
        .references('id')
        .inTable(ETableNames.cidade)
        .onUpdate('CASCADE')
        .onDelete('RESTRICT');

      table.string('bairro', 255).nullable();
      table.string('logradouro', 255).nullable();
      table.string('numero', 10).nullable();
      table.string('complemento', 255).nullable();
      table.string('observacoes', 255).nullable();
    })
    .then(() => {
      console.log(`# Created table ${ETableNames.pessoa}`);
    });
}

export async function down(knex: Knex) {
  return knex
    .schema
    .dropTable(ETableNames.pessoa)
    .then(() => {
      console.log(`# Dropped table ${ETableNames.pessoa}`);
    });
}