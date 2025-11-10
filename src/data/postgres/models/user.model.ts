import { db } from '../knex';

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  img?: string;
  role?: string[];
}

export const UserModel = {
  async findByEmail(email: string) {
    return db('users').where({ email }).first();
  },

  async findById(id: string) {
    return db('users').where({ id }).first();
  },

  async create(data: CreateUserDTO) {
    const [user] = await db('users')
      .insert({
        name: data.name,
        email: data.email,
        password: data.password,
        img: data.img || null,
        role: data.role || ['USER_ROLE'],
      })
      .returning('*');
    return user;
  },

  async getAll() {
    return db('users').select('*');
  },
};