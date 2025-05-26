import { CreateProdutorDto } from '../../interfaces/http/dtos/create-produtor.dto';
import { IProdutorRepository } from 'src/core/repository/produtor.repository';
import { Produtor } from 'src/core/entities/produtor.entity';
import { BadRequestException } from '@nestjs/common';

export class CreateProdutorUseCase {
  constructor(private readonly repo: IProdutorRepository) {}

  async execute(data: CreateProdutorDto): Promise<Produtor> {
    if (data.areaAgricultavel + data.areaVegetacao > data.areaTotal) {
      throw new BadRequestException(
        'The sum of the areas cannot exceed the total area',
      );
    }
    return this.repo.save(data as Produtor);
  }
}
