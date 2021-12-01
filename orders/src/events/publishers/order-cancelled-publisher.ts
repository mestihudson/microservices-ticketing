import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@mestihudson-ticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
