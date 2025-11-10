import { db } from '../knex';

interface CreateCategoryDTO {
  name: string;
  description: string;
}

const CATEGORY_TABLE = 'categories';

export const CategoryModel = {
  async findByName(name: string) {
    return db(CATEGORY_TABLE).where({ name, is_deleted: false }).first();
  },
  async create(data: CreateCategoryDTO, user_id?: string) {
    const [category] = await db(CATEGORY_TABLE)
      .insert({
        name: data.name,
        description: data.description,
        user_id
      })
      .returning('*');
    return category;
  },

  async getAllWithPagination(page: number, limit: number) {
    const offset = (page - 1) * limit;
    return db(CATEGORY_TABLE)
      .select('*')
      .where({ is_deleted: false })
      .limit(limit)
      .offset(offset);
  },

  async getTotal() {
    return db(CATEGORY_TABLE)
    .where({ is_deleted: false })
    .count<{ count: string }[]>('* as count')
    .first();
  },

  async getById(id: number) {
    return db(CATEGORY_TABLE).where({ id, is_deleted: false }).first();
  },

  async update(data: CreateCategoryDTO, id?: number) {
    if (!id) throw new Error('Missing category ID');

    const [category] = await db(CATEGORY_TABLE)
      .where({ id })
      .update({
        name: data.name,
        description: data.description,
        updated_at: new Date()
      })
      .returning('*');

    return category;
  },

  async categoryHasBooks(id: number) {
    const result = await db('books')
      .where({ category_id: id, is_deleted: false })
      .first();
    return !!result;
  },

  async delete(id: number) {
    return db(CATEGORY_TABLE)
      .where({ id })
      .update({
        is_deleted: true,
        updated_at: new Date()
      });
  }



};