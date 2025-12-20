/* eslint-disable no-unused-vars */
import { PaginatedResult } from "../helper/pagination";
import { Concert } from "../model/Concert";



export interface IConcertRepository {


  getBaseQuery(): any;
  findById(id: string): Promise<Concert | null>;

  /**
   * Find all concerts with optional pagination
   * @param page page number (default 1)
   * @param limit items per page (default 10)
   */
  findAll(page?: number, limit?: number): Promise<PaginatedResult<Concert>>;

  create(concert: Omit<Concert, "id">): Promise<Concert>;
  update(concert: Concert): Promise<Concert | null>;
  delete(id: string): Promise<void>;
}
