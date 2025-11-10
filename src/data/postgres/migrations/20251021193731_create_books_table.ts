import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('books', (table) => {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.string('author', 150).notNullable();
    table.string('isbn', 50).notNullable().unique();
    table.integer('publication_year');
    table.integer('category_id')
      .notNullable()
      .references('id')
      .inTable('categories')
      .onDelete('RESTRICT');
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
    table.integer('total_quantity').notNullable().defaultTo(1);
    table.integer('available_quantity').notNullable().defaultTo(1);
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('books');
}