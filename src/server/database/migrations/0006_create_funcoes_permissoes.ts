import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
  return knex
    .schema
    .createTable(ETableNames.funcao_permissao, table => {

      table.uuid('organizacao_id').notNullable().references('id').inTable(ETableNames.organizacao);

      table.uuid('empresa_id').notNullable().references('id').inTable(ETableNames.empresa);

      table.uuid('funcao_id').notNullable().references('id').inTable(ETableNames.funcao);

      table.uuid('permissao_id').notNullable().references('id').inTable(ETableNames.permissao);

      table.primary(['organizacao_id','empresa_id','funcao_id','permissao_id']);
    })
    .then(() => {
      console.log(`# Created table ${ETableNames.funcao_permissao}`);
    });
}

export async function down(knex: Knex) {
  return knex
    .schema
    .dropTable(ETableNames.funcao_permissao)
    .then(() => {
      console.log(`# Dropped table ${ETableNames.funcao_permissao}`);
    });
}