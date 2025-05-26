import { IRelatorioCulturasRepository } from 'src/core/repository/relatorio-cultura.repository';

export class RelatorioProdutorEstadoUseCase {
  constructor(private readonly repo: IRelatorioCulturasRepository) {}

  async execute(): Promise<{ [key: string]: { [key: string]: number } }> {
    const relatorios = await this.repo.findAll();

    const resultadoAgrupado: Record<string, Record<string, number>> = {};

    return relatorios.reduce((acc, relatorio) => {
      if (!acc[relatorio.estado]) {
        acc[relatorio.estado] = {};
      }
      acc[relatorio.estado][relatorio.nome] = relatorio.total;
      return acc;
    }, resultadoAgrupado);
  }
}
