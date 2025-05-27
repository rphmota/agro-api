# Agro API

API NestJS para cadastro de produtores rurais. Usa PostgreSQL, Docker e Clean Architecture.

## Subir ambientes com Docker

```bash
docker-compose up
```

as colections postman estão na raiz do projeto

### Testes (API + banco de teste)

#### Vao ser rodados os testes atraves do script start-dev.sh onde o mesmo executa os testes e sobe a api

## Resetar banco de dados

Se quiser forçar recriar os bancos de desenvolvimento e teste:

```bash
chmod +x scripts/reset-db.sh
./scripts/reset-db.sh
```

## Diretórios principais

- `src/core`: entidades e enums
- `src/app`: use cases
- `src/infra`: TypeORM e banco
- `src/interfaces/http`: entrada HTTP (controllers, dtos)

## Desenvolvimento local

#### renomeie o arquivo .env.development com localhost no nome da url do banco foi feito dessa forma para simplificar a subida via docker excplisivamente apos isso rode

```bash
#instalar as dependencias,
pnmp install

pnpm run start:dev
```

## Pontos de melhorias

- `Testes`: ampliar os casos de testes
- `Autenticacao`: implementar guards e roles para questao da seguranca
- `Isolamento de Dominios`: por conta de dominio praticamente unico foi adicionado dentro do da pasta core para um escalonamento da aplicacao recomenda-se isolar de forma mais clara
- `Ambiente`: Isolamento das variaveis de ambiente para nao ficarem expostas como vao ficar nesse repositorio
- `Documentação`: Adicionar nos Dtos e no controller os decorators do swagger para uma melhor visualizacao da aplicacao
- `Banco de Dados`: Culturas é um array de string na tabela produtores
  isso pode ser um problema, recomenda-se criar uma tabela para garantir a integridade referencial, criar indices nos filtros mais usados, ampliar para ter uma entidade fazenda.
