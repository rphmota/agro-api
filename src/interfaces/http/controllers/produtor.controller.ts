import {
  Controller,
  Post,
  Body,
  Inject,
  Put,
  Param,
  Delete,
  HttpCode,
  Get,
} from '@nestjs/common';
import { CreateProdutorDto } from '../dtos/create-produtor.dto';
import { CreateProdutorUseCase } from '../../../app/usecases/create-produtor.usecase';
import { UpdateProdutorUseCase } from '../../../app/usecases/update-produtor.usecase';
import { DeleteProdutorUseCase } from '../../../app/usecases/delete-produtor.usecase';
import { FindProdutorUseCase } from '../../../app/usecases/find-produtor.usecase';
import { UpdateProdutorDto } from '../dtos/update-produtor.dto';

@Controller('produtores')
export class ProdutorController {
  constructor(
    @Inject('CREATE_PRODUTOR_USE_CASE')
    private readonly usecase: CreateProdutorUseCase,
    @Inject('UPDATE_PRODUTOR_USE_CASE')
    private readonly updateUsecase: UpdateProdutorUseCase,
    @Inject('DELETE_PRODUTOR_USE_CASE')
    private readonly deleteUsecase: DeleteProdutorUseCase,
    @Inject('FIND_PRODUTOR_USE_CASE')
    private readonly findUsecase: FindProdutorUseCase,
  ) {}

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.findUsecase.execute(id);
  }

  @Post()
  async create(@Body() body: CreateProdutorDto) {
    return this.usecase.execute(body);
  }

  @Put(':id')
  async update(@Body() body: UpdateProdutorDto, @Param('id') id: string) {
    return this.updateUsecase.execute(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteUsecase.execute(id);
  }
}
