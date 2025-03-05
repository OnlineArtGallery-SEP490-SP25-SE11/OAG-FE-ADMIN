import { createApi } from "@/lib/axios";
import { ApiResponse } from "@/types/response";
import axiosInstance from "axios";

const eventService = {
  
  async getEvents(accessToken: string) {
    try {
      const res = await createApi().get("/event", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return res.data;
    } catch (error) {
      if (axiosInstance.isAxiosError(error)) {
        console.error(error);
        console.error(`Error when getting events: ${error.response?.data.errorCode}`);
      } else {
        console.error(`Unexpected error: ${error}`);
      }
    }
  },

  async getEventById(eventId: string) {
    try {
      const res = await createApi().get(`/event/${eventId}`);
      return res.data;
    } catch (error) {
      if (axiosInstance.isAxiosError(error)) {
        console.error(error);
        console.error(`Error when getting event by ID: ${error.response?.data.errorCode}`);
      } else {
        console.error(`Unexpected error: ${error}`);
      }
    }
  },

  async createEvent({
    accessToken,
    eventData,
  }: {
    accessToken: string;
    eventData: {
      title: string;
      description: string;
      image: string;
      type: string;
      status: string;
      organizer: string;
      startDate: string;
      endDate: string;
    };
  }) {
    try {
      const res: ApiResponse = await createApi(accessToken).post("/event", eventData);
      if (res.status === 201) {
        return res.data;
      } else {
        console.error(`Invalid event data: ${res.message}`);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      return null;
    }
  },

  async deleteEvent(eventId: string) {
    try {
      await createApi().delete(`/event/${eventId}`);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  },

  async updateEvent({
    accessToken,
    updateData,
  }: {
    accessToken: string;
    updateData: {
      _id: string;
      title?: string;
      description?: string;
      image?: string;
      type?: string;
      status?: string;
      organizer?: string;
      participants?: string[];
      startDate?: string;
      endDate?: string;
    };
  }) {
    try {
      const res: ApiResponse = await createApi(accessToken).put(
        `/event/${updateData._id}`,
        updateData,
        {   
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(res.data, "update event response");
      return res.data;
    } catch (error) {
      if (axiosInstance.isAxiosError(error)) {
        console.error(error);
        console.error(`Error when updating event: ${error.response?.data.errorCode}`);
      } else {
        console.error(`Unexpected error: ${error}`);
      }
    }
  },
};

export default eventService;