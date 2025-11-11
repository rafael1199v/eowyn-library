import { Knex } from 'knex';
import { bcryptAdapter } from '../../../config';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('users');
  if (exists) return;
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('img').nullable();
    table.specificType('role', 'text[]').defaultTo('{USER_ROLE}');
    table.boolean('emailValidated').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

   await knex('users').insert([
    {
      name: 'Admin',
      email: 'admin@example.com',
      password: bcryptAdapter.hash('123456'),
      img: null,
      role: ['ADMIN_ROLE'],
      emailValidated: true,
    },
    {
      name: 'Gandalf',
      email: 'gandalf@example.com',
      password: bcryptAdapter.hash('123456'),
      img: null,
      role: ['USER_ROLE'],
      emailValidated: true,
    },
  ]);

}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}