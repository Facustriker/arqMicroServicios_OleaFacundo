import { getChannel } from '../../tools/rabbitmq';
import { ResenaService } from '../../domain/services/ResenaService';
import { ResenaYaExisteError } from '../../domain/errors/CustomErrors';
import { ConsumeMessage } from 'amqplib'; 

interface OrderPlacedEvent {
  orderId: string;
  cartId: string;
  userId: string;
  articles: Array<{
    articleId: string;
    quantity: number;
  }>;
}

export async function startOrderConsumer(resenaService: ResenaService) {
  const channel = getChannel();
  
  const exchange = 'order_placed';
  const queue = 'reviews_order_placed';
  
  await channel.assertExchange(exchange, 'fanout', { durable: false });
  await channel.assertQueue(queue, { durable: false });
  await channel.bindQueue(queue, exchange, '');
  
  console.log(`Esperando eventos de órdenes en cola: ${queue}`);
  
  channel.consume(queue, async (msg: ConsumeMessage | null) => { 
    if (msg) {
      try {
        const content = msg.content.toString();
        
        //PARA DEBUG UNICAMENTE
        console.log('Mensaje RAW recibido:', content);
        
        const wrapper = JSON.parse(content);
        const evento: OrderPlacedEvent = wrapper.message;
        
        console.log('Orden recibida:', {
          orderId: evento.orderId,
          userId: evento.userId,
          articlesCount: evento.articles?.length || 0
        });
        
        if (!evento.articles || !Array.isArray(evento.articles) || evento.articles.length === 0) {
          console.log('Orden sin artículos, ignorando');
          channel.ack(msg);
          return;
        }
        
        for (const article of evento.articles) {
          try {
            const usuarioID = evento.userId;
            const productoID = article.articleId;
            
            await resenaService.crearResenaVacia(usuarioID, productoID);
            console.log(`Reseña vacía creada para artículo ${article.articleId}`);
          } catch (error) {
            if (error instanceof ResenaYaExisteError) {
              console.log(`${error.message}. Continuando...`);
            } else {
              console.error(`Error creando reseña para artículo ${article.articleId}:`, error);
            }
          }
        }
        
        channel.ack(msg);
        console.log(`Orden ${evento.orderId} procesada completamente`);
        
      } catch (error) {
        console.error('Error procesando mensaje:', error);
        channel.nack(msg, false, false);
      }
    }
  });
}