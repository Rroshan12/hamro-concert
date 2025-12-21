/* eslint-disable no-unused-vars */
import { ITicketTierRepository } from "../interface/ITicketTierRepository";
import { TicketTierMapper } from "../mapper/TicketTierMapper";
import { TicketTierVM } from "../viewmodel/TicketTierVM";
import { TicketTier } from "../model/TicketTier";
import { paginate, PaginatedResult } from "../helper/pagination";
import { db } from "../database";
import { ticketTiers } from "../database/schema/ticket.tire.schema";

export class TicketTierService {
  private db = db;
  constructor(private repo: ITicketTierRepository) {}

  async create(vm: Omit<TicketTierVM, "id">): Promise<TicketTierVM> {
    const model: Omit<TicketTier, "id"> = {
      concertId: vm.concertId,
      ticketTypeId: vm.ticketTypeId,
      price: vm.price,
      total: vm.total,
      available: vm.available,
    };
    const created = await this.repo.create(model);
    return TicketTierMapper.toVM(created);
  }

  async getAll(page: number, limit: number): Promise<PaginatedResult<TicketTierVM>> {
    const query = this.repo.getBaseQuery();
    const paged = await paginate<TicketTier>(this.db, query, ticketTiers, page, limit);
    return { ...paged, data: TicketTierMapper.toVMList(paged.data as any) } as any;
  }


  async getAllNoPaginate(): Promise<TicketTier[]> {
    const rows = await this.db.select().from(ticketTiers);
    return rows as TicketTier[];
  }

  async getById(id: number): Promise<TicketTierVM | null> {
    const item = await this.repo.findById(id);
    if (!item) return null;
    return TicketTierMapper.toVM(item);
  }

  async update(vm: TicketTierVM): Promise<TicketTierVM | null> {
    const updated = await this.repo.update(TicketTierMapper.toModel(vm));
    if (!updated) return null;
    return TicketTierMapper.toVM(updated);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
