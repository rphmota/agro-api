import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProdutorUseCase } from '../update-produtor.usecase';
import { IProdutorRepository } from '../../../core/repository/produtor.repository';
import { Produtor } from '../../../core/entities/produtor.entity';
import { CreateProdutorDto } from '../../../interfaces/http/dtos/create-produtor.dto';
import { Cultura } from '../../../core/enums/cultura.enum';

describe('UpdateProdutorUseCase', () => {
  let useCase: UpdateProdutorUseCase;
  let mockProdutorRepository: jest.Mocked<IProdutorRepository>;

  const existingProdutorId = 'existing-uuid';
  const mockExistingProdutor = new Produtor(
    existingProdutorId,
    'Old Name',
    '111.111.111-11',
    'Old Farm',
    'Old City',
    'OS',
    100,
    50,
    30,
    [Cultura.MILHO],
  );

  beforeEach(async () => {
    mockProdutorRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UpdateProdutorUseCase,
          useValue: new UpdateProdutorUseCase(mockProdutorRepository),
        },
      ],
    }).compile();

    useCase = module.get<UpdateProdutorUseCase>(UpdateProdutorUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update a producer successfully when producer exists and area validation passes', async () => {
      const updateDto: CreateProdutorDto = {
        nome: 'New Name',
        cpfCnpj: '222.222.222-22',
        fazenda: 'New Farm',
        cidade: 'New City',
        estado: 'NS',
        areaTotal: 120,
        areaAgricultavel: 60,
        areaVegetacao: 40,
        culturas: [Cultura.SOJA, Cultura.ALGODAO],
      };

      const expectedUpdatedProdutor = new Produtor(
        existingProdutorId,
        updateDto.nome,
        updateDto.cpfCnpj,
        updateDto.fazenda,
        updateDto.cidade,
        updateDto.estado,
        updateDto.areaTotal,
        updateDto.areaAgricultavel,
        updateDto.areaVegetacao,
        updateDto.culturas,
      );

      mockProdutorRepository.findById.mockResolvedValue(mockExistingProdutor);
      mockProdutorRepository.save.mockResolvedValue(expectedUpdatedProdutor);

      const result = await useCase.execute(existingProdutorId, updateDto);

      expect(mockProdutorRepository['findById']).toHaveBeenCalledWith(
        existingProdutorId,
      );
      expect(mockProdutorRepository['save']).toHaveBeenCalledWith(
        expectedUpdatedProdutor,
      );
      expect(result).toEqual(expectedUpdatedProdutor);
    });

    it('should update a producer successfully with partial data, using existing values for areas', async () => {
      const updateDto: Partial<CreateProdutorDto> = {
        nome: 'Partially New Name',
      };

      const expectedProdutorAfterPartialUpdate = new Produtor(
        existingProdutorId,
        updateDto.nome!,
        mockExistingProdutor.cpfCnpj,
        mockExistingProdutor.fazenda,
        mockExistingProdutor.cidade,
        mockExistingProdutor.estado,
        mockExistingProdutor.areaTotal, // existing
        mockExistingProdutor.areaAgricultavel, // existing
        mockExistingProdutor.areaVegetacao, // existing
        mockExistingProdutor.culturas,
      );
      // 50 + 30 <= 100 (using existing areas) - This should pass

      mockProdutorRepository.findById.mockResolvedValue(mockExistingProdutor);
      mockProdutorRepository.save.mockResolvedValue(
        expectedProdutorAfterPartialUpdate,
      );

      const result = await useCase.execute(
        existingProdutorId,
        updateDto as CreateProdutorDto,
      );

      expect(mockProdutorRepository['findById']).toHaveBeenCalledWith(
        existingProdutorId,
      );
      expect(mockProdutorRepository['save']).toHaveBeenCalledWith(
        expectedProdutorAfterPartialUpdate,
      );
      expect(result).toEqual(expectedProdutorAfterPartialUpdate);
    });

    it('should throw an error if producer is not found', async () => {
      const nonExistentId = 'non-existent-uuid';
      const updateDto: CreateProdutorDto = {
        nome: 'Any Name',
      } as CreateProdutorDto;

      mockProdutorRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(nonExistentId, updateDto)).rejects.toThrow(
        'Produtor not found',
      );
      expect(mockProdutorRepository['findById']).toHaveBeenCalledWith(
        nonExistentId,
      );
      expect(mockProdutorRepository['save']).not.toHaveBeenCalled();
    });

    it('should throw an error if areaAgricultavel + areaVegetacao > areaTotal on update', async () => {
      const updateDto: CreateProdutorDto = {
        nome: 'Valid Name',
        cpfCnpj: '333.333.333-33',
        fazenda: 'Valid Farm',
        cidade: 'Valid City',
        estado: 'VS',
        areaTotal: 100,
        areaAgricultavel: 70,
        areaVegetacao: 40,
        culturas: [Cultura.CAFE],
      };

      mockProdutorRepository.findById.mockResolvedValue(mockExistingProdutor);

      await expect(
        useCase.execute(existingProdutorId, updateDto),
      ).rejects.toThrow('The sum of the areas cannot exceed the total area');
      expect(mockProdutorRepository['findById']).toHaveBeenCalledWith(
        existingProdutorId,
      );
      expect(mockProdutorRepository['save']).not.toHaveBeenCalled();
    });
  });
});
