import { Produtor } from '../entities/produtor.entity';

export interface IProdutorRepository {
  findById(id: string): Promise<Produtor | null>;
  save(produtor: Produtor): Promise<Produtor>;
  delete(id: string): Promise<void>;
}
