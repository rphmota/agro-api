import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infra/database/database.module';
import { ProdutorRepository } from './infra/database/repositories/produtor.repository';
import { ProdutorController } from './interfaces/http/controllers/produtor.controller';
import { CreateProdutorUseCase } from './app/usecases/create-produtor.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutorOrmEntity } from './infra/entities/produtor.orm-entity';
import { UpdateProdutorUseCase } from './app/usecases/update-produtor.usecase';
import { DeleteProdutorUseCase } from './app/usecases/delete-produtor.usecase';
import { FindProdutorUseCase } from './app/usecases/find-produtor.usecase';
import { RelatorioProdutorEstadoUseCase } from './app/usecases/relatorio-produtor-estado.usecase';
import { RelatorioProducaoController } from './interfaces/http/controllers/relatorio-producao.controller';
import { RelatorioCulturasRepository } from './infra/database/repositories/relatorio-cultura.repository';
import { RelatorioTotalFazendasUseCase } from './app/usecases/relatorio-total-farms.usecase';
import { RelatorioTotalHectaresUseCase } from './app/usecases/relatorio-total-hectares';

@Module({
  controllers: [ProdutorController, RelatorioProducaoController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([ProdutorOrmEntity]),
  ],
  providers: [
    {
      provide: 'PRODUTOR_REPOSITORY',
      useClass: ProdutorRepository,
    },
    {
      provide: 'RELATORIO_PRODUTOR_ESTADO_REPOSITORY',
      useClass: RelatorioCulturasRepository,
    },
    {
      provide: 'CREATE_PRODUTOR_USE_CASE',
      useFactory: (produtorRepo) => {
        return new CreateProdutorUseCase(produtorRepo);
      },
      inject: ['PRODUTOR_REPOSITORY'],
    },
    {
      provide: 'UPDATE_PRODUTOR_USE_CASE',
      useFactory: (produtorRepo) => {
        return new UpdateProdutorUseCase(produtorRepo);
      },
      inject: ['PRODUTOR_REPOSITORY'],
    },
    {
      provide: 'DELETE_PRODUTOR_USE_CASE',
      useFactory: (produtorRepo) => {
        return new DeleteProdutorUseCase(produtorRepo);
      },
      inject: ['PRODUTOR_REPOSITORY'],
    },
    {
      provide: 'FIND_PRODUTOR_USE_CASE',
      useFactory: (produtorRepo) => {
        return new FindProdutorUseCase(produtorRepo);
      },
      inject: ['PRODUTOR_REPOSITORY'],
    },
    {
      provide: 'RELATORIO_PRODUTOR_ESTADO_USE_CASE',
      useFactory: (produtorRepo) => {
        return new RelatorioProdutorEstadoUseCase(produtorRepo);
      },
      inject: ['RELATORIO_PRODUTOR_ESTADO_REPOSITORY'],
    },
    {
      provide: 'RELATORIO_TOTAL_FAZENDAS_USE_CASE',
      useFactory: (relatorioRepo) => {
        return new RelatorioTotalFazendasUseCase(relatorioRepo);
      },
      inject: ['RELATORIO_PRODUTOR_ESTADO_REPOSITORY'],
    },
    {
      provide: 'RELATORIO_TOTAL_HECTARES_USE_CASE',
      useFactory: (relatorioRepo) => {
        return new RelatorioTotalHectaresUseCase(relatorioRepo);
      },
      inject: ['RELATORIO_PRODUTOR_ESTADO_REPOSITORY'],
    },
  ],
})
export class AppModule {}
