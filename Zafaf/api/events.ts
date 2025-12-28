import api from "./index";
import { Event } from "../types/Event";

interface EventFilters {
  area?: string;
  category?: string;
  familyName?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const getEvents = async (filters: EventFilters) => {
  const response = await api.get("/events", { params: filters });
  return response.data;
};

export const getEventById = async (id: string): Promise<{ event: Event }> => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (eventData: Partial<Event>) => {
  const response = await api.post("/events", eventData);
  return response.data;
};

export const updateEvent = async (id: string, eventData: Partial<Event>) => {
  const response = await api.put(`/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id: string): Promise<void> => {
  await api.delete(`/events/${id}`);
};

export const likeEvent = async (id: string) => {
  const response = await api.post(`/events/${id}/like`);
  return response.data;
};
