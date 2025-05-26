import { Test, TestingModule } from '@nestjs/testing';
import { RelatorioProdutorEstadoUseCase } from '../relatorio-produtor-estado.usecase';
import { IRelatorioCulturasRepository } from '../../../core/repository/relatorio-cultura.repository';
import { RelatorioCultura } from '../../../core/entities/relatorio-cultura.entity';

describe('RelatorioProdutorEstadoUseCase', () => {
  let useCase: RelatorioProdutorEstadoUseCase;
  let mockRelatorioCulturasRepository: jest.Mocked<IRelatorioCulturasRepository>;

  beforeEach(async () => {
    mockRelatorioCulturasRepository = {
      findAll: jest.fn(),
      findByEstado: jest.fn(),
      findTotalFarms: jest.fn(),
      SumTotalFarmsHectares: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelatorioProdutorEstadoUseCase,
        {
          provide: RelatorioProdutorEstadoUseCase,
          useValue: new RelatorioProdutorEstadoUseCase(
            mockRelatorioCulturasRepository,
          ),
        },
      ],
    }).compile();

    useCase = module.get<RelatorioProdutorEstadoUseCase>(
      RelatorioProdutorEstadoUseCase,
    );
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return an empty object if repository returns no relatorios', async () => {
      mockRelatorioCulturasRepository.findAll.mockResolvedValue([]);
      const result = await useCase.execute();
      expect(result).toEqual({});
      expect(mockRelatorioCulturasRepository['findAll']).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should correctly group relatorios by estado and then by nome', async () => {
      const mockRelatorios: RelatorioCultura[] = [
        new RelatorioCultura('Milho', 'SP', 2),
        new RelatorioCultura('Soja', 'SP', 5),
        new RelatorioCultura('Café', 'MG', 10),
        new RelatorioCultura('Cana de Açúcar', 'SP', 3),
        new RelatorioCultura('Algodão', 'BA', 7),
        new RelatorioCultura('Soja', 'MG', 8),
      ];

      mockRelatorioCulturasRepository.findAll.mockResolvedValue(mockRelatorios);

      const result = await useCase.execute();

      const expectedResult = {
        SP: {
          Milho: 2,
          Soja: 5,
          'Cana de Açúcar': 3,
        },
        MG: {
          Café: 10,
          Soja: 8,
        },
        BA: {
          Algodão: 7,
        },
      };

      expect(result).toEqual(expectedResult);
      expect(mockRelatorioCulturasRepository['findAll']).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should handle a single relatorio item correctly', async () => {
      const mockRelatorios: RelatorioCultura[] = [
        new RelatorioCultura('Milho', 'SP', 15),
      ];
      mockRelatorioCulturasRepository.findAll.mockResolvedValue(mockRelatorios);

      const result = await useCase.execute();

      const expectedResult = {
        SP: {
          Milho: 15,
        },
      };
      expect(result).toEqual(expectedResult);
    });
  });
});
