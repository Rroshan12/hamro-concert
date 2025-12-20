/* eslint-disable no-unused-vars */
import { Concert } from "../model/Concert";


export interface IConcertRepository {
  findById(id: string): Promise<Concert | null>;
  findAll(): Promise<Concert[]>;
  create(concert: Omit<Concert, "id">): Promise<Concert>;
  update(concert: Concert): Promise<Concert | null>;
  delete(id: string): Promise<void>;
}
