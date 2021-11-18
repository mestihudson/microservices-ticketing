import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('listener connected to nats');

  stan.on('close', () => {
    console.log('nats connection closed');
    process.exit();
  });

  const options = stan.subscriptionOptions().setManualAckMode(true);
  const subscription = stan
    .subscribe('ticket:created', 'orders-service-queue-group', options);

  subscription.on('message', (message: Message) => {
    const data = message.getData();

    if (typeof data === 'string') {
      console.log(
        `received event #${message.getSequence()}: `,
        JSON.parse(data),
        ` at ${new Date()}`
      );
    }

    message.ack();
  });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
