import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { ProdutorOrmEntity } from './src/infra/entities/produtor.orm-entity';

const env = dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

console.log(env);

if (!env.parsed?.DATABASE_URL) {
  throw new Error('DATABASE_URL not found. Check your .env or NODE_ENV');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.parsed?.DATABASE_URL,
  entities: [ProdutorOrmEntity],
  migrations: ['src/infra/database/migrations/*{.ts,.js}'],
  synchronize: false,
});
