import { IProdutorRepository } from 'src/core/repository/produtor.repository';
import { Produtor } from 'src/core/entities/produtor.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateProdutorDto } from 'src/interfaces/http/dtos/update-produtor.dto';

export class UpdateProdutorUseCase {
  constructor(private readonly repo: IProdutorRepository) {}

  async execute(id: string, data: UpdateProdutorDto): Promise<Produtor> {
    const existingProdutor: Produtor | null = await this.repo.findById(id);

    if (!existingProdutor) {
      throw new NotFoundException('Produtor not found');
    }

    const areaTotal: number =
      (typeof data.areaTotal === 'number'
        ? Number(data.areaTotal)
        : undefined) ?? existingProdutor.areaTotal;
    const areaAgricultavel: number =
      (typeof data.areaAgricultavel === 'number'
        ? Number(data.areaAgricultavel)
        : undefined) ?? existingProdutor.areaAgricultavel;

    const areaVegetacao: number =
      (typeof data.areaVegetacao === 'number'
        ? Number(data.areaVegetacao)
        : undefined) ?? existingProdutor.areaVegetacao;

    if (areaAgricultavel + areaVegetacao > areaTotal) {
      throw new BadRequestException(
        'The sum of the areas cannot exceed the total area',
      );
    }

    return this.repo.save({
      ...existingProdutor,
      ...data,
      areaTotal,
      areaAgricultavel,
      areaVegetacao,
    } as Produtor);
  }
}
