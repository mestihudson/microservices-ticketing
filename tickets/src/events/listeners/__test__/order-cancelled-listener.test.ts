import { OrderCancelledEvent } from "@mestihudson-ticketing/common";
import { OrderCancelledListener } from "@/events/listeners/order-cancelled-listener";
import { natsWrapper } from "@/nats-wrapper";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const data: OrderCancelledEvent["data"] = {};
  return { listener, data };
};

it("should throw an error if ticket has not found", async () => {
  const { listener, data } = await setup();

  try {
    await listener.onMessage(data);
  } catch (error) {
    return;
  }

  throw new Error("An exception should have been raised");
});

it.todo("should update orderId field of ticket with undefined value");
it.todo("should acknowledge message");
it.todo("should notify about ticket update");
