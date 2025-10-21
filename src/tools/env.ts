import * as dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 3005,
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'arqMicro'
  },
  rabbit: {
    url: process.env.RABBIT_URL || 'amqp://localhost'
  }
};