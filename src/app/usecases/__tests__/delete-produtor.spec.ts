import { Test, TestingModule } from '@nestjs/testing';
import { DeleteProdutorUseCase } from '../delete-produtor.usecase';
import { IProdutorRepository } from '../../../core/repository/produtor.repository';
import { Produtor } from '../../../core/entities/produtor.entity';
import { Cultura } from '../../../core/enums/cultura.enum';

describe('DeleteProdutorUseCase', () => {
  let useCase: DeleteProdutorUseCase;
  let mockProdutorRepository: jest.Mocked<IProdutorRepository>;

  const existingProdutorId = 'existing-uuid-to-delete';
  const mockExistingProdutor = new Produtor(
    existingProdutorId,
    'To Be Deleted',
    '000.000.000-00',
    'Delete Farm',
    'Delete City',
    'DS',
    10,
    5,
    5,
    [Cultura.SOJA],
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
          provide: DeleteProdutorUseCase,
          useValue: new DeleteProdutorUseCase(mockProdutorRepository),
        },
      ],
    }).compile();

    useCase = module.get<DeleteProdutorUseCase>(DeleteProdutorUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should delete a producer successfully if producer exists', async () => {
      mockProdutorRepository.findById.mockResolvedValue(mockExistingProdutor);
      mockProdutorRepository.delete.mockResolvedValue(undefined);

      await useCase.execute(existingProdutorId);

      expect(mockProdutorRepository['findById']).toHaveBeenCalledWith(
        existingProdutorId,
      );
      expect(mockProdutorRepository['delete']).toHaveBeenCalledWith(
        existingProdutorId,
      );
    });

    it('should throw an error if producer to delete is not found', async () => {
      const nonExistentId = 'non-existent-uuid';
      mockProdutorRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(nonExistentId)).rejects.toThrow(
        'Produtor not found',
      );

      expect(mockProdutorRepository['findById']).toHaveBeenCalledWith(
        nonExistentId,
      );
      expect(mockProdutorRepository['delete']).not.toHaveBeenCalled();
    });
  });
});
