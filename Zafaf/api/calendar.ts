import api from "./index";
import { CalendarEvent } from "../types/Calendar";

export const getCalendarEvents = async () => {
  const response = await api.get("/calendar");
  return response.data;
};

export const saveEventToCalendar = async (
  eventId: string
): Promise<{ calendarEvent: CalendarEvent }> => {
  const response = await api.post(`/calendar/${eventId}`);
  return response.data;
};

export const removeEventFromCalendar = async (
  eventId: string
): Promise<void> => {
  await api.delete(`/calendar/${eventId}`);
};
