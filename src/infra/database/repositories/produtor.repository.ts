export const PRODUTOR_REPOSITORY = 'PRODUTOR_REPOSITORY';
import { Produtor } from 'src/core/entities/produtor.entity';
import { IProdutorRepository } from 'src/core/repository/produtor.repository';
import { ProdutorOrmEntity } from '../../entities/produtor.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProdutorRepository implements IProdutorRepository {
  constructor(
    @InjectRepository(ProdutorOrmEntity)
    private readonly repository: Repository<ProdutorOrmEntity>,
  ) {}
  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async save(produtor: Produtor): Promise<Produtor> {
    const entity = this.repository.create(produtor);
    await this.repository.save(entity);
    return entity;
  }

  async findById(id: string): Promise<Produtor | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? entity.toDomain() : null;
  }
}
