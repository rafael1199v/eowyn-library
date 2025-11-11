
import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('loans');
  if (exists) return;
  await knex.schema.createTable('loans', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable()
      .references('id').inTable('users').onDelete('RESTRICT');
    table.integer('book_id')
      .notNullable()
      .references('id')
      .inTable('books')
      .onDelete('RESTRICT');
    table.date('start_date').notNullable().defaultTo(knex.raw('CURRENT_DATE'));
    table.date('due_date').notNullable();
    table.date('return_date').nullable();
    table.string('status', 20).defaultTo('ongoing'); // ongoing, returned, overdue
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('loans');
}