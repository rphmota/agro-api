import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { ProdutorRepository } from '../produtor.repository';
import { ProdutorOrmEntity } from '../../../entities/produtor.orm-entity';
import { Produtor } from '../../../../core/entities/produtor.entity';
import { Cultura } from '../../../../core/enums/cultura.enum';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

describe('ProdutorRepository', () => {
  let repository: ProdutorRepository;
  let mockOrmRepository: MockRepository<ProdutorOrmEntity>;

  const mockProdutorDomain = new Produtor(
    'test-id',
    'Test Produtor',
    '123.456.789-00',
    'Fazenda Teste',
    'Cidade Teste',
    'TS',
    100,
    50,
    30,
    [Cultura.SOJA],
  );

  const mockProdutorOrmEntity = new ProdutorOrmEntity();
  Object.assign(mockProdutorOrmEntity, {
    ...mockProdutorDomain,
    toDomain: () => mockProdutorDomain,
  });

  beforeEach(async () => {
    mockOrmRepository = createMockRepository<ProdutorOrmEntity>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutorRepository,
        {
          provide: getRepositoryToken(ProdutorOrmEntity),
          useValue: mockOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<ProdutorRepository>(ProdutorRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('delete', () => {
    it('should call repository.delete with the correct id', async () => {
      const id = 'test-id-to-delete';
      mockOrmRepository.delete?.mockResolvedValue({ affected: 1, raw: [] });

      await repository.delete(id);

      expect(mockOrmRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('save', () => {
    it('should create and save a produtor entity and return the domain produtor', async () => {
      mockOrmRepository.create?.mockReturnValue(mockProdutorOrmEntity);
      mockOrmRepository.save?.mockResolvedValue(mockProdutorOrmEntity);

      const result = await repository.save(mockProdutorDomain);

      expect(mockOrmRepository.create).toHaveBeenCalledWith(mockProdutorDomain);
      expect(mockOrmRepository.save).toHaveBeenCalledWith(
        mockProdutorOrmEntity,
      );

      expect(result).toEqual(mockProdutorOrmEntity);
    });
  });

  describe('findById', () => {
    it('should find an entity by id and return the domain produtor if found', async () => {
      const id = 'test-id';

      const foundOrmEntity = {
        ...mockProdutorOrmEntity,
        toDomain: jest.fn().mockReturnValue(mockProdutorDomain),
      };
      mockOrmRepository.findOne?.mockResolvedValue(foundOrmEntity);

      const result = await repository.findById(id);

      expect(mockOrmRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(foundOrmEntity.toDomain).toHaveBeenCalled();
      expect(result).toEqual(mockProdutorDomain);
    });

    it('should return null if no entity is found by id', async () => {
      const id = 'non-existent-id';
      mockOrmRepository.findOne?.mockResolvedValue(null);

      const result = await repository.findById(id);

      expect(mockOrmRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toBeNull();
    });
  });
});
