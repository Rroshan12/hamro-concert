import http from "./http";
import  { type TicketTier } from "../types";

export interface Paginated<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];
}

export async function getTicketTiers(params?: { page?: number; limit?: number }) {
  const res = await http.get<Paginated<TicketTier>>("/ticket-tiers", { params });
  return res.data;
}

export async function getTicketTierById(id: string | number) {
  const res = await http.get<TicketTier>(`/ticket-tiers/${id}`);
  return res.data;
}

export async function createTicketTier(payload: Omit<TicketTier, "id">) {
  const res = await http.post<TicketTier>("/ticket-tiers", payload);
  return res.data;
}

// Backend expects id in body for PUT
export async function updateTicketTier(payload: TicketTier) {
  const res = await http.put<TicketTier>("/ticket-tiers", payload);
  return res.data;
}

export async function deleteTicketTier(id: string | number) {
  const res = await http.delete<void>(`/ticket-tiers/${id}`);
  return res.status === 204;
}

// Fetch all tiers without pagination
export async function getAllTicketTiers() {
  const res = await http.get<TicketTier[]>("/ticket-tiers/all");
  return res.data;
}
