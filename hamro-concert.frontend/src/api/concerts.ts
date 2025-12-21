import http from "./http";
import  { type Concert } from "../types";

export interface Paginated<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];
}

export async function getConcerts(params?: { page?: number; limit?: number }) {
  const res = await http.get<Paginated<Concert>>("/concerts", { params });
  return res.data;
}

export async function getConcertById(id: string) {
  const res = await http.get<Concert>(`/concerts/${id}`);
  return res.data;
}

export async function createConcert(payload: Omit<Concert, "id">) {
  const res = await http.post<Concert>("/concerts", payload);
  return res.data;
}

// Backend expects id in body for PUT
export async function updateConcert(payload: Concert) {
  const res = await http.put<Concert>("/concerts", payload);
  return res.data;
}

export async function deleteConcert(id: string) {
  const res = await http.delete<void>(`/concerts/${id}`);
  return res.status === 204;
}
