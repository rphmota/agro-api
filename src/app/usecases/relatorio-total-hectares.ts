import { IRelatorioCulturasRepository } from 'src/core/repository/relatorio-cultura.repository';

export class RelatorioTotalHectaresUseCase {
  constructor(private readonly repo: IRelatorioCulturasRepository) {}

  async execute(): Promise<{ totalHectares: number }> {
    const resultado = await this.repo.SumTotalFarmsHectares();

    return {
      totalHectares: resultado.total,
    };
  }
}
