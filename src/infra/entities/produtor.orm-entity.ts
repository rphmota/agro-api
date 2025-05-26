import { Produtor } from '../../core/entities/produtor.entity';
import { Cultura } from '../../core/enums/cultura.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('produtores')
export class ProdutorOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  cpfCnpj: string;

  @Column()
  fazenda: string;

  @Column()
  cidade: string;

  @Column()
  estado: string;

  @Column('float')
  areaTotal: number;

  @Column('float')
  areaAgricultavel: number;

  @Column('float')
  areaVegetacao: number;

  @Column('text', { array: true })
  culturas: Cultura[];

  toDomain(): Produtor {
    return {
      id: this.id,
      nome: this.nome,
      cpfCnpj: this.cpfCnpj,
      fazenda: this.fazenda,
      cidade: this.cidade,
      estado: this.estado,
      areaTotal: this.areaTotal,
      areaAgricultavel: this.areaAgricultavel,
      areaVegetacao: this.areaVegetacao,
      culturas: this.culturas,
    };
  }
}
