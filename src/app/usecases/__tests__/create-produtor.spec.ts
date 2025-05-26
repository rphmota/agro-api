import { Test, TestingModule } from '@nestjs/testing';
import { CreateProdutorUseCase } from '../create-produtor.usecase';
import { IProdutorRepository } from 'src/core/repository/produtor.repository';
import { Produtor } from '../../../core/entities/produtor.entity';
import { CreateProdutorDto } from '../../../interfaces/http/dtos/create-produtor.dto';
import { Cultura } from '../../../core/enums/cultura.enum';

describe('CreateProdutorUseCase', () => {
  let useCase: CreateProdutorUseCase;
  let mockProdutorRepository: jest.Mocked<IProdutorRepository>;

  beforeEach(async () => {
    mockProdutorRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateProdutorUseCase,
          useValue: new CreateProdutorUseCase(mockProdutorRepository),
        },
      ],
    }).compile();

    useCase = module.get<CreateProdutorUseCase>(CreateProdutorUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a producer successfully when area validation passes', async () => {
      const createProdutorDto: CreateProdutorDto = {
        nome: 'John Doe',
        cpfCnpj: '123.456.789-00',
        fazenda: 'Fazenda Feliz',
        cidade: 'Cidade Alegre',
        estado: 'SP',
        areaTotal: 100,
        areaAgricultavel: 50,
        areaVegetacao: 30,
        culturas: [Cultura.SOJA, Cultura.MILHO],
      };

      const expectedProdutor = new Produtor(
        'some-uuid',
        createProdutorDto.nome,
        createProdutorDto.cpfCnpj,
        createProdutorDto.fazenda,
        createProdutorDto.cidade,
        createProdutorDto.estado,
        createProdutorDto.areaTotal,
        createProdutorDto.areaAgricultavel,
        createProdutorDto.areaVegetacao,
        createProdutorDto.culturas,
      );

      mockProdutorRepository.save.mockResolvedValue(expectedProdutor);

      const result = await useCase.execute(createProdutorDto);

      expect(mockProdutorRepository['save']).toHaveBeenCalledWith(
        createProdutorDto,
      );
      expect(result).toEqual(expectedProdutor);
    });

    it('should throw an error if areaAgricultavel + areaVegetacao > areaTotal', async () => {
      const createProdutorDto: CreateProdutorDto = {
        nome: 'Jane Doe',
        cpfCnpj: '987.654.321-00',
        fazenda: 'Fazenda Triste',
        cidade: 'Cidade Chuvosa',
        estado: 'RJ',
        areaTotal: 100,
        areaAgricultavel: 70,
        areaVegetacao: 40,
        culturas: [Cultura.CAFE],
      };

      await expect(useCase.execute(createProdutorDto)).rejects.toThrow(
        'The sum of the areas cannot exceed the total area',
      );
      expect(mockProdutorRepository['save']).not.toHaveBeenCalled();
    });
  });
});
