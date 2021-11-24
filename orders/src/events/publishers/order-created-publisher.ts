import {
  Publisher, BaseEvent, OrderStatus, OrderCreatedEvent, Subjects
} from '@mestihudson-ticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}