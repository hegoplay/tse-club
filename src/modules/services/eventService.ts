import { Event, MediaData, MediaResponse } from "@/constant/types";
import { HttpClient } from "@/lib/HttpClient";
import { isTokenExpired } from "@/lib/utils";

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
  rangeTimeType?: string;
}) => {
  const response = http.get(`${API_PREFIX_EVENT_PATH}/me/search`, {
    params,
  });
  return response.then((res) => res._embedded ? res._embedded.eventWrapperDtoList : []);
};

export const getPublicEvents = (params?: {
  page?: number;
  size?: number;
  sort?: string;
  eventType?: string;
  isDone?: boolean;
  keyword?: string;
  category?: string;
  startTime?: string;
  rangeTimeType?: string;
}) => {
  const response = http.get(`${API_PREFIX_PUBLIC_EVENT_PATH}/search`, {
    params,
  });
  return response.then((res) => res._embedded ? res._embedded.eventWrapperDtoList : []);
};

export const getEventPublicById = (id: string) =>
  http.get(`${API_PREFIX_PUBLIC_EVENT_PATH}/${id}`);

export const registerForEvent = (id: string) =>
  http.post(`${API_PREFIX_EVENT_PATH}/${id}/self-trigger-register`);

export const getRegisteredEvents = (params?: {
  page?: number;
  size?: number;
  keyword?: string;
  type?: string;
  isDone?: boolean;
  startTime?: string;
  endTime?: string;
  sort?: string;
  rangeTimeType?: string;
}) => {
  const request = { request: params };
  const response = http.get(
    `${API_PREFIX_EVENT_PATH}/search/registered-events`,
    { params: request }
  );
  return response.then((res) => res._embedded ? res._embedded.eventWrapperDtoList : []);
};

export const selfCheckIn = (
  eventId: string,
  data: { code: string; attendeeId: string }
) =>
  http.post(`${API_PREFIX_PUBLIC_EVENT_PATH}/${eventId}/self-check-in`, data);

export const addReview = (eventId: string, review: string) =>
  http.post(`${API_PREFIX_EVENT_PATH}/seminar/${eventId}/add-review`, review);

export const registerForEventWithoutLogin = (
  eventId: string,
  data: {
    fullName: string;
    email: string;
    dateOfBirth: string;
    nickname: string;
  }
) => http.post(`${API_PREFIX_PUBLIC_EVENT_PATH}/${eventId}/register`, data);
