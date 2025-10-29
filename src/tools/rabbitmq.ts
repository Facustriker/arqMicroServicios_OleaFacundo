import amqp from 'amqplib';
import { env } from './env';

let connection: any = null;  //Cambiar a any temporalmente
let channel: any = null;     //Cambiar a any temporalmente

export async function initializeRabbitMQ() {
  try {
    connection = await amqp.connect(env.rabbit.url);
    channel = await connection.createChannel();
    
    console.log('Conexión a RabbitMQ establecida');
    
    return channel;
  } catch (error) {
    console.error('Error conectando a RabbitMQ:', error);
    throw error;
  }
}

export function getChannel() {
  if (!channel) {
    throw new Error('RabbitMQ channel no inicializado');
  }
  return channel;
}

export async function closeRabbitMQ() {
  if (channel) await channel.close();
  if (connection) await connection.close();
}