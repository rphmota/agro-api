import { Cultura } from '../enums/cultura.enum';

export class Produtor {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly cpfCnpj: string,
    public readonly fazenda: string,
    public readonly cidade: string,
    public readonly estado: string,
    public readonly areaTotal: number,
    public readonly areaAgricultavel: number,
    public readonly areaVegetacao: number,
    public readonly culturas: Cultura[],
  ) {}
}
