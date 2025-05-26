import { IProdutorRepository } from 'src/core/repository/produtor.repository';
import { Produtor } from 'src/core/entities/produtor.entity';
import { NotFoundException } from '@nestjs/common';

export class FindProdutorUseCase {
  constructor(private readonly repo: IProdutorRepository) {}

  async execute(id: string): Promise<Produtor> {
    const existingProdutor = await this.repo.findById(id);
    if (!existingProdutor) {
      throw new NotFoundException('Produtor not found');
    }
    return existingProdutor;
  }
}
