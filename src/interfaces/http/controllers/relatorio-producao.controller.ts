import { Controller, Get, Inject } from '@nestjs/common';
import { RelatorioProdutorEstadoUseCase } from '../../../app/usecases/relatorio-produtor-estado.usecase';
import { RelatorioTotalFazendasUseCase } from '../../../app/usecases/relatorio-total-farms.usecase';
import { RelatorioTotalHectaresUseCase } from '../../../app/usecases/relatorio-total-hectares';

@Controller('relatorio-producao')
export class RelatorioProducaoController {
  constructor(
    @Inject('RELATORIO_PRODUTOR_ESTADO_USE_CASE')
    private readonly relatorioProdutorEstadoUseCase: RelatorioProdutorEstadoUseCase,
    @Inject('RELATORIO_TOTAL_FAZENDAS_USE_CASE')
    private readonly relatorioTotalFazendasUseCase: RelatorioTotalFazendasUseCase,
    @Inject('RELATORIO_TOTAL_HECTARES_USE_CASE')
    private readonly relatorioTotalHectaresUseCase: RelatorioTotalHectaresUseCase,
  ) {}

  @Get()
  async getRelatorioProducao() {
    const relatorio = await this.relatorioProdutorEstadoUseCase.execute();
    return relatorio;
  }
  @Get('total-fazendas')
  async getTotalFazendas() {
    return this.relatorioTotalFazendasUseCase.execute();
  }
  @Get('total-hectares')
  async getTotalHectares() {
    return this.relatorioTotalHectaresUseCase.execute();
  }
}
