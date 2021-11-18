import { Subjects } from './subjects';

export interface BaseEvent {
  subject: Subjects;
  data: any;
}
