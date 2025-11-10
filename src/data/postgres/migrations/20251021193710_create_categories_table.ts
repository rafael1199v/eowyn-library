import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('categories', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.string('description').notNullable();
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.boolean('is_deleted').notNullable().defaultTo(false);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('categories');
}