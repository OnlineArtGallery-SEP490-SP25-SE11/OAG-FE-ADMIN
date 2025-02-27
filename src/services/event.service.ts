import axios from 'axios';
import { CreateEventPayload, Event, UpdateEventPayload } from '@/types/event';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const EventService = {
  getEvents: async (): Promise<Event[]> => {
    const response = await axios.get(`${API_URL}/api/event`);
    return response.data.data;
  },

  createEvent: async (payload: CreateEventPayload): Promise<Event> => {
    const response = await axios.post(`${API_URL}/api/event`, payload);
    return response.data.data;
  },

  updateEvent: async (payload: UpdateEventPayload): Promise<Event> => {
    const response = await axios.put(`${API_URL}/api/event/${payload._id}`, payload);
    return response.data.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/api/event/${id}`);
  }
}; 