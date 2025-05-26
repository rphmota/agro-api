import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsCpfCnpjConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    const cpfCnpj = value.replace(/[^\d]+/g, '');

    return /^\d{11}$/.test(cpfCnpj) || /^\d{14}$/.test(cpfCnpj);
  }

  defaultMessage(): string {
    return 'CPF ou CNPJ inválido.';
  }
}

export function IsCpfCnpj(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCpfCnpjConstraint,
    });
  };
}
