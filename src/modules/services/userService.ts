import { USER_TYPES } from "@/constant/data";
import {
  Event,
  MediaData,
  MediaResponse,
  PointHistorySearchRequestDto,
  SearchDto,
  UserFormRequestDto,
} from "@/constant/types";
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

export const getInfoUser = async () => {
  const response = http.get(`${API_PREFIX_PATH}/me`);
  return response;
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

export const getMyPointHistory = async (
  params?: PointHistorySearchRequestDto
) => {
  const response = http.get(`${API_PREFIX_PATH}/me/point-history`, {
    params,
  });
  return response;
};

export const getUpdateRequests = async (params : SearchDto) => {
  const response = http.get(`${API_PREFIX_PATH}/search/update-requests`);
  return response;
}

export const createUpdateRequest = async (data: UserFormRequestDto) => {
  const response = http.post(`${API_PREFIX_PATH}/update-requests`, data);
  return response;
}

export const deleteUpdateRequest = async (id: string) => {
  const response = http.delete(`${API_PREFIX_PATH}/update-requests/${id}`);
  return response;
}

export const encodeBitwiseType = (selectedValues: number[]): number => {
  return selectedValues.reduce((acc, current) => acc | current, 0);
};

export const decodeBitwiseType = (bitwiseValue?: number, types?: Record<string, number>): number[] => {
  if (!bitwiseValue || bitwiseValue === 0) return [];

  const selectedValues: number[] = [];

  for (const [_, value] of Object.entries(types || USER_TYPES)) {
    if ((bitwiseValue & value) === value) {
      selectedValues.push(value);
    }
  }

  return selectedValues;
};
