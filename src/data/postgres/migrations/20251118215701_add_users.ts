import { Knex } from 'knex';
import { bcryptAdapter } from '../../../config';

function createTestUser(index: number) {
  const name = `TestUser_${index}`;
  const email = `user${index}@test.com`;
  const passwordHash = bcryptAdapter.hash('password123');

  return {
    name: name,
    email: email,
    password: passwordHash,
    img: null,
    role: ['USER_ROLE'],
    emailValidated: true,
  };
}

export async function up(knex: Knex): Promise<void> {
  const usersToInsert = [];
  const numberOfUsers = 20;

  for (let i = 1; i <= numberOfUsers; i++) {
    usersToInsert.push(createTestUser(i));
  }

  await knex('users').insert(usersToInsert);
  
  console.log(`Se insertaron ${numberOfUsers} usuarios de prueba.`);
}

export async function down(knex: Knex): Promise<void> {
  await knex('users')
    .where('email', 'like', '%@test.com')
    .del();
    
  console.log(`Se eliminaron los usuarios de prueba.`);
}