import { RelatorioCultura } from '../entities/relatorio-cultura.entity';

export interface IRelatorioCulturasRepository {
  findAll(): Promise<RelatorioCultura[]>;
  findByEstado(estado: string): Promise<RelatorioCultura>;
  findTotalFarms(): Promise<{ total: number }>;
  SumTotalFarmsHectares(): Promise<{ total: number }>;
}
