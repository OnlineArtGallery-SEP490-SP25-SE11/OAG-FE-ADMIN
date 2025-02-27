export interface Event {
  _id: string;
  title: string;
  description: string;
  type: string;
  status: 'ongoing' | 'upcoming' | 'ended';
  organizer: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  participants: string[];
  image: string;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  type: string;
  status: 'ongoing' | 'upcoming' | 'ended';
  organizer: string;
  startDate: Date;
  endDate: Date;
  image: string;
}

export interface UpdateEventPayload extends CreateEventPayload {
  _id: string;
} 