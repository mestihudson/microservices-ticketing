import { Ticket } from '@/models/ticket';

it('should throw an error because of optimistic concurrency control', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  });
  await ticket.save();

  const first = await Ticket.findById(ticket.id);
  const second = await Ticket.findById(ticket.id);

  first!.set({ price: 10 });
  second!.set({ price: 15 });

  await first!.save();
  try {
    await second!.save();
  } catch (err) {
    return;
  }

  throw new Error('Should not reach this point');
});
