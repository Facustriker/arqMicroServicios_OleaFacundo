import 'reflect-metadata';
import { startRestServer } from './rest/server';
import { startRabbitConsumer } from './rabbit/consumers';
import { initializeDatabase } from './tools/db';


async function main() {
  
  await initializeDatabase();

  await startRestServer();
  
  await startRabbitConsumer();
  
  console.log('Microservicio de Reseñas iniciado');
}

main();