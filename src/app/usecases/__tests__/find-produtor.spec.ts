import { Test, TestingModule } from '@nestjs/testing';
import { FindProdutorUseCase } from '../find-produtor.usecase';
import { IProdutorRepository } from '../../../core/repository/produtor.repository';
import { Produtor } from '../../../core/entities/produtor.entity';
import { Cultura } from '../../../core/enums/cultura.enum';

describe('FindProdutorUseCase', () => {
  let useCase: FindProdutorUseCase;
  let mockProdutorRepository: jest.Mocked<IProdutorRepository>;

  const existingProdutorId = 'existing-uuid-to-find';
  const mockExistingProdutor = new Produtor(
    existingProdutorId,
    'Found Produtor',
    '123.123.123-12',
    'Found Farm',
    'Found City',
    'FS',
    200,
    100,
    80,
    [Cultura.CAFE, Cultura.ALGODAO],
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
          provide: FindProdutorUseCase,
          useValue: new FindProdutorUseCase(mockProdutorRepository),
        },
      ],
    }).compile();

    useCase = module.get<FindProdutorUseCase>(FindProdutorUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a producer if found', async () => {
      mockProdutorRepository.findById.mockResolvedValue(mockExistingProdutor);

      const result = await useCase.execute(existingProdutorId);

      expect(mockProdutorRepository['findById']).toHaveBeenCalledWith(
        existingProdutorId,
      );
      expect(result).toEqual(mockExistingProdutor);
    });

    it('should throw an error if producer is not found', async () => {
      const nonExistentId = 'non-existent-uuid';
      mockProdutorRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(nonExistentId)).rejects.toThrow(
        'Produtor not found',
      );

      expect(mockProdutorRepository['findById']).toHaveBeenCalledWith(
        nonExistentId,
      );
    });
  });
});
