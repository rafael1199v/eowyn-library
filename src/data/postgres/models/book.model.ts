import { get } from 'http';
import { db } from '../knex';
import { title } from 'process';

interface CreateBookDto {
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  categoryId: number;
  totalQuantity: number;
  availableQuantity: number;
}

const BOOK_TABLE = 'books';

export const BookModel = {
  async create(data: CreateBookDto, user_id?: string) {
    const [book] = await db(BOOK_TABLE)
      .insert({
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        publication_year: data.publicationYear,
        category_id: data.categoryId,
        total_quantity: data.totalQuantity,
        available_quantity: data.availableQuantity,
        user_id
      })
      .returning('*');
    return book;
  },

  async getByIsbn(isbn: string) {
    return db(BOOK_TABLE).where({ isbn, is_deleted: false }).first();
  },

  async getAllWithPagination(page: number, limit: number) {
    const offset = (page - 1) * limit;
    return db(BOOK_TABLE)
      .select('*')
      .where({ is_deleted: false })
      .limit(limit)
      .offset(offset);
  },

  async getTotal() {
    return db(BOOK_TABLE)
    .where({ is_deleted: false })
    .count<{ count: string }[]>('* as count')
    .first();
  },

  async getById(id: number) {
    return db(BOOK_TABLE).where({ id, is_deleted: false}).first();
  },

  async update(data: CreateBookDto, id?: number) {
    const [book] = await db(BOOK_TABLE)
      .where({ id })
      .update({
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        publication_year: data.publicationYear,
        category_id: data.categoryId,
        total_quantity: data.totalQuantity,
        available_quantity: data.availableQuantity,
        updated_at: new Date()
      })
      .returning('*');
    return book;
  },

  async delete(id: number) {
    return db(BOOK_TABLE)
      .where({ id })
      .update({
        is_deleted: true,
        updated_at: new Date()
      });
  },

  async bookHasLoans(id: number): Promise<boolean> {
    const result = await db('loans')
      .where({ book_id: id })
      .whereIn('status', ['ongoing', 'overdue']) // préstamos activos
      .first();
    return !!result;
  }


};