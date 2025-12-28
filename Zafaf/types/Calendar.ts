import { Event } from "./Event";

export interface CalendarEvent {
  _id: string;
  event: Event;
  user: string;
  savedAt: string;
}
