import type { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });


const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: process.env.PG_URL,
    migrations: {
      directory: 'migrations',
      extension: 'ts',
    },
  },
};

export default config;