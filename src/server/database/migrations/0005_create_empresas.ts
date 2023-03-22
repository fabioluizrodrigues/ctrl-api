import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
  return knex
    .schema
    .createTable(ETableNames.empresa, table => {
      table.uuid('id').primary().index().notNullable();

      table.uuid('organizacao_id').references('id').inTable(ETableNames.organizacao);

      table.string('cnpj_cpf', 20).index().unique().notNullable(); //19092935000173
      table.string('nome_razao', 255).index().notNullable();
      table.string('email', 255).unique().notNullable();
      table.string('telefone', 20).unique().notNullable(); 

      table.string('ie_rg', 20).nullable();
      table.string('cep', 8).nullable(); //78840000
      table.string('estado', 2).nullable().checkLength('<=', 2);

      table.uuid('cidade_id').references('id').inTable(ETableNames.cidade);

      table.string('bairro', 255).nullable();
      table.string('logradouro', 255).nullable();
      table.string('numero', 10).nullable();
      table.string('complemento', 255).nullable();
      table.string('observacoes', 255).nullable();
    })
    .then(() => {
      console.log(`# Created table ${ETableNames.empresa}`);
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