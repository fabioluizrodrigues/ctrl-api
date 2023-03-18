import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
  return knex
    .schema
    .createTable(ETableNames.usuario_funcao, table => {

      table.uuid('organizacao_id').notNullable().references('id').inTable(ETableNames.organizacao);

      table.uuid('empresa_id').notNullable().references('id').inTable(ETableNames.empresa);

      table.uuid('usuario_id').notNullable().references('id').inTable(ETableNames.usuario);

      table.uuid('funcao_id').notNullable().references('id').inTable(ETableNames.funcao);

      table.primary(['organizacao_id','empresa_id','usuario_id','funcao_id']);
    })
    .then(() => {
      console.log(`# Created table ${ETableNames.usuario_funcao}`);
    });
}

export async function down(knex: Knex) {
  return knex
    .schema
    .dropTable(ETableNames.usuario_funcao)
    .then(() => {
      console.log(`# Dropped table ${ETableNames.usuario_funcao}`);
    });
}