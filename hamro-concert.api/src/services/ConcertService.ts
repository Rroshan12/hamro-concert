/* eslint-disable no-unused-vars */
import { IConcertRepository } from "../interface/IConcertRepository";
import { ConcertMapper } from "../mapper/ConcertMapper";
import { ConcertVM } from "../viewmodel/ConcertVM";
import { Concert } from "../model/Concert";
import { paginate, PaginatedResult } from "../helper/pagination";
import { db } from "../database";
import { concerts } from "../database/schema/concert.schema";

export class ConcertService {
  private db = db;
  constructor(private concertRepo: IConcertRepository) {}

  async createConcert(concertVM: ConcertVM): Promise<ConcertVM> {
    const concertModel: Concert = ConcertMapper.toModel(concertVM);
    const created = await this.concertRepo.create(concertModel);
    return ConcertMapper.toVM(created);
  }

  async getConcerts(
    page: number,
    limit: number
  ): Promise<PaginatedResult<ConcertVM>> {
    const query = this.concertRepo.getBaseQuery();
    return paginate<ConcertVM>(this.db, query, concerts, page, limit);
  }

  async getConcertById(id: string): Promise<ConcertVM | null> {
    const concert: Concert | null = await this.concertRepo.findById(id);
    if (!concert) {
      return null;
    }
    return ConcertMapper.toVM(concert);
  }

  async updateConcert(concertVM: ConcertVM): Promise<ConcertVM | null> {
    const updated: Concert | null = await this.concertRepo.update(
      ConcertMapper.toModel(concertVM)
    );
    if (!updated) {
      return null;
    }
    return ConcertMapper.toVM(updated);
  }

  async deleteConcert(id: string): Promise<void> {
    await this.concertRepo.delete(id);
  }
}
