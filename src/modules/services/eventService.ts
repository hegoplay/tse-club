import { Event, MediaData, MediaResponse } from "@/constant/types";
import { HttpClient } from "@/lib/HttpClient";
import { AxiosRequestHeaders } from "axios";

const API_PREFIX_EVENT_PATH = "/events";
const API_PREFIX_PUBLIC_EVENT_PATH = "/public/events";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

const http = new HttpClient(BASE_URL);

export const createEvent = (data: Event) =>
  http.post<Event>(`${API_PREFIX_EVENT_PATH}`, data);

export const getEvents = (params?: {
  page?: number;
  limit?: number;
  eventType?: string;
  isDone?: boolean;
  keyword?: string;
  category?: string;
  status?: string;
}) => {
  const response = http.get(`${API_PREFIX_EVENT_PATH}/me/search`, {
    params,
  });
  return response.then((res) => res._embedded.eventWrapperDtoList);
};

export const getEventById = (id: string) =>
  http.get(`${API_PREFIX_EVENT_PATH}/${id}`);

export const updateEvent = (id: string, data: Event) =>
  http.put<Event>(`${API_PREFIX_EVENT_PATH}/${id}`, data);

export const deleteEvent = (id: string) =>
  http.delete<{ message: string }>(`${API_PREFIX_EVENT_PATH}/${id}`);

export const modifyOrganizers = (id: string, organizers: any[]) =>
  http.put<Event>(`${API_PREFIX_EVENT_PATH}/${id}/modify-organizers`, {
    organizers,
  });

export const banUserFromEvent = (eventId: string, userId: string[]) =>
  http.put<Event>(`${API_PREFIX_EVENT_PATH}/${eventId}/trigger-ban-user`, {
    attendeeIds: userId,
  });

export const getPublicEvents = (params?: {
  page?: number;
  size?: number;
  sort?: string;
  eventType?: string;
  isDone?: boolean;
  keyword?: string;
  category?: string;
}) => {
  const response = http.get(`${API_PREFIX_PUBLIC_EVENT_PATH}/search`, {
    params,
  });
  return response.then((res) => res._embedded.eventWrapperDtoList);
};

export const getEventPublicById = (id: string) =>
  http.get(`${API_PREFIX_PUBLIC_EVENT_PATH}/${id}`);

export const registerForEvent = (id: string) =>
  http.post(`${API_PREFIX_EVENT_PATH}/${id}/self-trigger-register`);
