import { initializeRabbitMQ } from '../../tools/rabbitmq';
import { startOrderConsumer } from './orderConsumer';
import { ResenaService } from '../../domain/services/ResenaService';
import { ResenaRepository } from '../../infrastructure/repositories/ResenaRepository';

export async function startRabbitConsumer() {
  try {
    
    await initializeRabbitMQ();
    
    const resenaRepository = new ResenaRepository();
    const resenaService = new ResenaService(resenaRepository);
    
    await startOrderConsumer(resenaService);
    
    console.log('Consumer de RabbitMQ iniciado');
  } catch (error) {
    console.error('Error iniciando consumer de RabbitMQ:', error);
    throw error;
  }
}