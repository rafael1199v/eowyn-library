import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('categories');
  if (!exists) {
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

    // Inserta registros iniciales
    await knex('categories').insert([
  { name: 'Tecnología', description: 'Gadgets y avances tecnológicos', user_id: 1, is_deleted: false },
  { name: 'Hogar', description: 'Consejos para el hogar y decoración', user_id: 1, is_deleted: false },
  { name: 'Libros', description: 'Reseñas y recomendaciones literarias', user_id: 1, is_deleted: false },
  { name: 'Salud', description: 'Bienestar físico y mental', user_id: 1, is_deleted: false },
  { name: 'Viajes', description: 'Destinos turísticos y experiencias', user_id: 1, is_deleted: false },
  { name: 'Educación', description: 'Recursos y noticias educativas', user_id: 1, is_deleted: false },
  { name: 'Finanzas', description: 'Consejos financieros y ahorro', user_id: 1, is_deleted: false },
  { name: 'Moda', description: 'Tendencias y estilo personal', user_id: 1, is_deleted: false },
  { name: 'Cocina', description: 'Recetas y técnicas culinarias', user_id: 1, is_deleted: false },
  { name: 'Cine', description: 'Películas y críticas cinematográficas', user_id: 1, is_deleted: false },
  { name: 'Música', description: 'Novedades y géneros musicales', user_id: 1, is_deleted: false },
  { name: 'Deportes', description: 'Noticias y análisis deportivos', user_id: 1, is_deleted: false },
  { name: 'Arte', description: 'Exposiciones y artistas destacados', user_id: 1, is_deleted: false },
  { name: 'Ciencia', description: 'Descubrimientos y divulgación científica', user_id: 1, is_deleted: false },
  { name: 'Emprendimiento', description: 'Ideas de negocio y startups', user_id: 1, is_deleted: false },
]);

  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('categories');
}