/* eslint-disable no-unused-vars */
import { PaginatedResult } from "../helper/pagination";
import { TicketTier } from "../model/TicketTier";

export interface ITicketTierRepository {
  getBaseQuery(): any;
  findById(id: number): Promise<TicketTier | null>;
  findAll(page?: number, limit?: number): Promise<PaginatedResult<TicketTier>>;
  create(ticketTier: Omit<TicketTier, "id">): Promise<TicketTier>;
  update(ticketTier: TicketTier): Promise<TicketTier | null>;
  delete(id: number): Promise<void>;
}
