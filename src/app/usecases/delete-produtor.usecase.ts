import { NotFoundException } from '@nestjs/common';
import { IProdutorRepository } from 'src/core/repository/produtor.repository';

export class DeleteProdutorUseCase {
  constructor(private readonly repo: IProdutorRepository) {}

  async execute(id: string): Promise<void> {
    const existingProdutor = await this.repo.findById(id);
    if (!existingProdutor) {
      throw new NotFoundException('Produtor not found');
    }

    await this.repo.delete(id);
  }
}
