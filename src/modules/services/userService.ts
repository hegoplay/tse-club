import { Event, MediaData, MediaResponse } from "@/constant/types";
import { HttpClient } from "@/lib/HttpClient";
import { AxiosRequestHeaders } from "axios";

const API_PREFIX_PATH = "/users";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

const http = new HttpClient(BASE_URL);

export const getUser = (params?: {
  page?: number;
  size?: number;
  keyword?: string;
  sort?: string;
}) => {
  const response = http.get(`${API_PREFIX_PATH}/search`, {
    params,
  });
  return response.then((res) => res._embedded.userShortInfoResponseDtoList);
};

export const getInfoUser = () => {
  const response = http.get(`${API_PREFIX_PATH}/me`);
  return response.then((res) => res);
};

export const updateUserInfo = (data: any) => {
  const response = http.put(`${API_PREFIX_PATH}/update-my-info`, data);
  return response.then((res) => res);
};

export const changePassword = (data: {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) => {
  const response = http.put(`${API_PREFIX_PATH}/update-my-password`, data);
  return response.then((res) => res);
};

export const updateRequest = (type: number) => {
  const response = http.post(`${API_PREFIX_PATH}/update-request`, { type });
  return response.then((res) => res);
};
