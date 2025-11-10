import { Client } from 'pg';

interface Options {
  pgUrl: string;
}

export class PostgresDatabase {
  static async connect(options: Options) {
    const { pgUrl } = options;
    const client = new Client({
      connectionString: pgUrl
    }); 
    try {
      await client.connect();
      console.log('pg connected');
      return true;
    } catch (error) {
      console.error('pg connection error:', error);
      throw error;
    }
  }
}