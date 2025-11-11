import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('books');
  if (!exists) {
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

    // Inserta 15 libros de ejemplo
    await knex('books').insert([
      { title: 'El Principito', author: 'Antoine de Saint-Exupéry', isbn: '9780001', publication_year: 1943, category_id: 1, user_id: 1 },
      { title: 'Cien Años de Soledad', author: 'Gabriel García Márquez', isbn: '9780002', publication_year: 1967, category_id: 1, user_id: 1 },
      { title: '1984', author: 'George Orwell', isbn: '9780003', publication_year: 1949, category_id: 1, user_id: 1 },
      { title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', isbn: '9780004', publication_year: 1605, category_id: 1, user_id: 1 },
      { title: 'Fahrenheit 451', author: 'Ray Bradbury', isbn: '9780005', publication_year: 1953, category_id: 1, user_id: 1 },
      { title: 'La Sombra del Viento', author: 'Carlos Ruiz Zafón', isbn: '9780006', publication_year: 2001, category_id: 1, user_id: 1 },
      { title: 'Orgullo y Prejuicio', author: 'Jane Austen', isbn: '9780007', publication_year: 1813, category_id: 1, user_id: 1 },
      { title: 'Crónica de una Muerte Anunciada', author: 'Gabriel García Márquez', isbn: '9780008', publication_year: 1981, category_id: 1, user_id: 1 },
      { title: 'El Alquimista', author: 'Paulo Coelho', isbn: '9780009', publication_year: 1988, category_id: 1, user_id: 1 },
      { title: 'Rayuela', author: 'Julio Cortázar', isbn: '9780010', publication_year: 1963, category_id: 1, user_id: 1 },
      { title: 'La Casa de los Espíritus', author: 'Isabel Allende', isbn: '9780011', publication_year: 1982, category_id: 1, user_id: 1 },
      { title: 'Los Juegos del Hambre', author: 'Suzanne Collins', isbn: '9780012', publication_year: 2008, category_id: 1, user_id: 1 },
      { title: 'Harry Potter y la Piedra Filosofal', author: 'J.K. Rowling', isbn: '9780013', publication_year: 1997, category_id: 1, user_id: 1 },
      { title: 'El Hobbit', author: 'J.R.R. Tolkien', isbn: '9780014', publication_year: 1937, category_id: 1, user_id: 1 },
      { title: 'Matar a un Ruiseñor', author: 'Harper Lee', isbn: '9780015', publication_year: 1960, category_id: 1, user_id: 1 },
    ]);
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('books');
}