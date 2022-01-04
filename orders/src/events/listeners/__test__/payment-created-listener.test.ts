import { PaymentCreatedEvent } from "@mestihudson-ticketing/common";
import { PaymentCreatedListener } from "@/events/listeners/payment-created-listener";
import { natsWrapper } from "@/nats-wrapper";

const setup = async () => {
  const listener = new PaymentCreatedListener(natsWrapper.client);

  //@ts-ignore
  const data: PaymentCreatedEvent["data"] = {};

  //@ts-ignore
  const message: Message = {};

  return { listener, data, message };
};

it("should throw an error if order has not found", async () => {
  const { listener, data, message } = await setup();

  try {
    await listener.onMessage(data, message);
  } catch (error) {
    return;
  }

  throw new Error("An exception should have been raised");
});

it("should update order status to completed", async () => {
  const { orderId } = await callListener();

  const updated = await Order.findById(orderId);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(updated!.status).toBe(OrderStatus.Complete);
});

it.todo("should emit a order completed event");
it.todo("should acknowledge a message");
