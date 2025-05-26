import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  IsEnum,
  Validate,
} from 'class-validator';
import { Cultura } from '../../../core/enums/cultura.enum';
import { IsCpfCnpjConstraint } from '../validators/cpf-cnpj.validator';

export class CreateProdutorDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @Validate(IsCpfCnpjConstraint)
  cpfCnpj: string;

  @IsString()
  fazenda: string;

  @IsString()
  cidade: string;

  @IsString()
  estado: string;

  @IsNumber()
  areaTotal: number;

  @IsNumber()
  areaAgricultavel: number;

  @IsNumber()
  areaVegetacao: number;

  @IsArray()
  @IsEnum(Cultura, { each: true })
  culturas: Cultura[];
}
