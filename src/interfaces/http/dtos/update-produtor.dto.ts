import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutorDto } from './create-produtor.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateProdutorDto extends PartialType(CreateProdutorDto) {}
