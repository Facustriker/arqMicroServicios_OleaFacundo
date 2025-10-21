import { DataSource } from 'typeorm';
import { env } from './env';
import { ResenaSchema } from '../infrastructure/schemas/ResenaSchema';
import { LikeSchema } from '../infrastructure/schemas/LikeSchema';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.mysql.host,
  port: env.mysql.port,
  username: env.mysql.user,
  password: env.mysql.password,
  database: env.mysql.database,
  synchronize: true,
  logging: false,
  entities: [ResenaSchema, LikeSchema],
});

export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('Conexión a MySQL establecida');
  } catch (error) {
    console.error('Error conectando a MySQL:', error);
    throw error;
  }
}