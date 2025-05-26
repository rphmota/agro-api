import { InjectRepository } from '@nestjs/typeorm';
import { RelatorioCultura } from '../../../core/entities/relatorio-cultura.entity';
import { IRelatorioCulturasRepository } from '../../../core/repository/relatorio-cultura.repository';
import { ProdutorOrmEntity } from '../../../infra/entities/produtor.orm-entity';
import { Repository } from 'typeorm';

export class RelatorioCulturasRepository
  implements IRelatorioCulturasRepository
{
  private BASE_QUERY = `
    SELECT
          p.estado,
          unnest_cultura AS cultura,
          COUNT(*) AS "totalFazendas"
      FROM
          produtores p,
          UNNEST(p.culturas) AS unnest_cultura
    `;

  constructor(
    @InjectRepository(ProdutorOrmEntity)
    private readonly produtorRepository: Repository<ProdutorOrmEntity>,
  ) {}

  async SumTotalFarmsHectares(): Promise<{ total: number }> {
    const result = await this.produtorRepository.query<{ total: string }[]>(
      `SELECT sum("areaTotal") AS total FROM produtores;`,
    );

    return {
      total: Number(result[0].total),
    };
  }

  async findTotalFarms(): Promise<{ total: number }> {
    const result = await this.produtorRepository.query<{ total: string }[]>(
      `SELECT COUNT(*) AS total FROM produtores;`,
    );

    return {
      total: Number(result[0].total),
    };
  }

  async findAll(): Promise<RelatorioCultura[]> {
    const query = await this.produtorRepository.query<
      {
        estado: string;
        cultura: string;
        totalFazendas: string;
      }[]
    >(
      `
        ${this.BASE_QUERY}
      GROUP BY
          p.estado,
          cultura
      ORDER BY
          p.estado,
          cultura;
    `,
    );

    return query.map((item) => ({
      estado: item.estado,
      nome: item.cultura,
      total: Number(item.totalFazendas),
    })) as RelatorioCultura[];
  }

  async findByEstado(estado: string): Promise<RelatorioCultura> {
    const query = await this.produtorRepository.query<
      {
        estado: string;
        cultura: string;
        totalFazendas: string;
      }[]
    >(
      `
        ${this.BASE_QUERY}
        WHERE p.estado = $1
      GROUP BY
          p.estado,
          cultura
      ORDER BY
          p.estado,
          cultura;
    `,
      [estado],
    );

    if (!Array.isArray(query) || query.length === 0) {
      throw new Error(`No data found for the state: ${estado}`);
    }

    return new RelatorioCultura(
      query[0].cultura,
      query[0].estado,
      Number(query[0].totalFazendas),
    );
  }
}
