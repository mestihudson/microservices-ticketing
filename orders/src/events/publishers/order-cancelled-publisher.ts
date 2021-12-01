import {
  Publisher,
  BaseEvent,
  OrderStatus,
  OrderCancelledEvent,
  Subjects,
} from "@mestihudson-ticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
