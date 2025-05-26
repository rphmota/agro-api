import { Test, TestingModule } from '@nestjs/testing';
import { RelatorioCulturasRepository } from '../relatorio-cultura.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProdutorOrmEntity } from '../../../../infra/entities/produtor.orm-entity';
import { Repository } from 'typeorm';
import { RelatorioCultura } from '../../../../core/entities/relatorio-cultura.entity';

import { ObjectLiteral } from 'typeorm';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  query: jest.fn(),
});

describe('RelatorioCulturasRepository', () => {
  let repository: RelatorioCulturasRepository;
  let mockProdutorOrmRepository: MockRepository<ProdutorOrmEntity>;

  beforeEach(async () => {
    mockProdutorOrmRepository = createMockRepository<ProdutorOrmEntity>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelatorioCulturasRepository,
        {
          provide: getRepositoryToken(ProdutorOrmEntity),
          useValue: mockProdutorOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<RelatorioCulturasRepository>(
      RelatorioCulturasRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of RelatorioCultura when data exists', async () => {
      const mockQueryResult = [
        { estado: 'SP', cultura: 'Soja', totalFazendas: '10' },
        { estado: 'SP', cultura: 'Milho', totalFazendas: '5' },
        { estado: 'MG', cultura: 'Café', totalFazendas: '20' },
      ];
      mockProdutorOrmRepository.query?.mockResolvedValue(mockQueryResult);

      const result = await repository.findAll();

      expect(result).toHaveLength(3);
      expect(result[0]).toBeInstanceOf(Object);
      expect(result[0]).toEqual({ nome: 'Soja', estado: 'SP', total: 10 });
      expect(result[1]).toEqual({ nome: 'Milho', estado: 'SP', total: 5 });
      expect(result[2]).toEqual({ nome: 'Café', estado: 'MG', total: 20 });
      expect(mockProdutorOrmRepository.query).toHaveBeenCalledWith(
        expect.stringContaining('GROUP BY'),
      );
    });

    it('should return an empty array when no data exists', async () => {
      mockProdutorOrmRepository.query?.mockResolvedValue([]);
      const result = await repository.findAll();
      expect(result).toEqual([]);
    });

    it('should correctly map totalFazendas to a number', async () => {
      const mockQueryResult = [
        { estado: 'PR', cultura: 'Trigo', totalFazendas: '7' },
      ];
      mockProdutorOrmRepository.query?.mockResolvedValue(mockQueryResult);

      const result = await repository.findAll();
      expect(result[0].total).toBe(7);
    });
  });

  describe('findByEstado', () => {
    const estado = 'SP';

    it('should return a RelatorioCultura when data exists for the state', async () => {
      const mockQueryResult = [
        { estado: 'SP', cultura: 'Soja', totalFazendas: '15' },
      ];
      mockProdutorOrmRepository.query?.mockResolvedValue(mockQueryResult);

      const result = await repository.findByEstado(estado);

      expect(result).toBeInstanceOf(RelatorioCultura);
      expect(result).toEqual({ nome: 'Soja', estado: 'SP', total: 15 });
      expect(mockProdutorOrmRepository.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE p.estado = $1'),
        [estado],
      );
    });

    it('should throw an error if no data (empty array) is found for the state', async () => {
      mockProdutorOrmRepository.query?.mockResolvedValue([]);

      await expect(repository.findByEstado(estado)).rejects.toThrow(
        `No data found for the state: ${estado}`,
      );
    });

    it('should throw an error if query result is not an array (e.g., null)', async () => {
      mockProdutorOrmRepository.query?.mockResolvedValue(null);

      await expect(repository.findByEstado(estado)).rejects.toThrow(
        `No data found for the state: ${estado}`,
      );
    });

    it('should throw an error if query result is not an array (e.g., an object)', async () => {
      const mockSingleObjectResult = {
        estado: 'SP',
        cultura: 'Soja',
        totalFazendas: '15',
      };
      mockProdutorOrmRepository.query?.mockResolvedValue(
        mockSingleObjectResult,
      );

      await expect(repository.findByEstado(estado)).rejects.toThrow(
        `No data found for the state: ${estado}`,
      );
    });

    it('should correctly map totalFazendas to a number in findByEstado', async () => {
      const mockQueryResult = [
        { estado: 'RJ', cultura: 'Cana', totalFazendas: '9' },
      ];
      mockProdutorOrmRepository.query?.mockResolvedValue(mockQueryResult);

      const result = await repository.findByEstado('RJ');
      expect(result.total).toBe(9);
    });
  });
});
