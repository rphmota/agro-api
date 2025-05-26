import { IRelatorioCulturasRepository } from 'src/core/repository/relatorio-cultura.repository';

export class RelatorioTotalFazendasUseCase {
  constructor(private readonly repo: IRelatorioCulturasRepository) {}

  async execute(): Promise<{ totalFazendas: number }> {
    const resultado = await this.repo.findTotalFarms();

    return {
      totalFazendas: resultado.total,
    };
  }
}
