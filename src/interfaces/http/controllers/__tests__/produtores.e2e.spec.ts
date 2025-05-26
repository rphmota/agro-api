import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../../../src/app.module';
import { CreateProdutorDto } from '../../../../../src/interfaces/http/dtos/create-produtor.dto';
import { Cultura } from '../../../../../src/core/enums/cultura.enum';
import { UpdateProdutorDto } from '../../dtos/update-produtor.dto';

describe('ProdutorController (e2e)', () => {
  let app: INestApplication;
  let createdProdutorId: string;
  const nonExistentUuid = '00000000-0000-0000-0000-000000000000';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/produtores (POST)', () => {
    it('should create a new produtor and return 201', async () => {
      const createDto: CreateProdutorDto = {
        nome: 'Produtor E2E Test',
        cpfCnpj: '02034282345',
        fazenda: 'Fazenda E2E',
        cidade: 'Cidade E2E',
        estado: 'TE',
        areaTotal: 200,
        areaAgricultavel: 100,
        areaVegetacao: 50,
        culturas: [Cultura.SOJA, Cultura.MILHO],
      };

      const response = await request(app.getHttpServer())
        .post('/produtores')
        .send(createDto)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.nome).toEqual(createDto.nome);
      createdProdutorId = response.body.id;
    });

    it('should return 400 if area validation fails', async () => {
      const createDto: CreateProdutorDto = {
        nome: 'Produtor E2E Invalid Area',
        cpfCnpj: '06262349000106',
        fazenda: 'Fazenda E2E Invalid',
        cidade: 'Cidade E2E Invalid',
        estado: 'TE',
        areaTotal: 100,
        areaAgricultavel: 80,
        areaVegetacao: 30,
        culturas: [Cultura.CAFE],
      };

      return request(app.getHttpServer())
        .post('/produtores')
        .send(createDto)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toContain(
            'The sum of the areas cannot exceed the total area',
          );
        });
    });

    it('should return 400 for invalid input (e.g., missing required field)', async () => {
      const createDto = {
        cpfCnpj: '80177808097',
        fazenda: 'Fazenda E2E Incomplete',
        cidade: 'Cidade E2E Incomplete',
        estado: 'TE',
        areaTotal: 100,
        areaAgricultavel: 50,
        areaVegetacao: 30,
        culturas: [Cultura.ALGODAO],
      };

      return request(app.getHttpServer())
        .post('/produtores')
        .send(createDto)
        .expect(400);
    });
  });

  describe('/produtores/:id (GET)', () => {
    it('should get an existing produtor and return 200', async () => {
      expect(createdProdutorId).toBeDefined();
      const response = await request(app.getHttpServer())
        .get(`/produtores/${createdProdutorId}`)
        .expect(200);

      expect(response.body.id).toEqual(createdProdutorId);
      expect(response.body.nome).toEqual('Produtor E2E Test');
    });

    it('should return 404 if produtor not found', () => {
      return request(app.getHttpServer())
        .get(`/produtores/${nonExistentUuid}`)
        .expect(404)
        .then((response) => {
          expect(response.body.message).toContain('Produtor not found');
        });
    });
  });

  describe('/produtores/:id (PUT)', () => {
    it('should update an existing produtor and return 200', async () => {
      expect(createdProdutorId).toBeDefined();

      const updateDto: UpdateProdutorDto = {
        nome: 'Produtor E2E Updated',
        cpfCnpj: '06262349000106', // ✅ CNPJ real e válido
        fazenda: 'Fazenda E2E Updated',
        cidade: 'Cidade E2E Updated',
        estado: 'MG',
        areaTotal: 250,
        areaAgricultavel: 120,
        areaVegetacao: 80,
        culturas: [Cultura.CAFE],
      };

      const response = await request(app.getHttpServer())
        .put(`/produtores/${createdProdutorId}`)
        .send(updateDto)
        .then((res) => {
          if (res.status !== 200) {
            console.error('❌ Erro no PUT /produtores/:id', res.body);
          }
          return res;
        });

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toEqual(createdProdutorId);
      expect(response.body.nome).toEqual(updateDto.nome);
      expect(response.body.cpfCnpj).toEqual(updateDto.cpfCnpj);
    });

    it('should return 404 when trying to update a non-existent produtor', () => {
      const updateDto: CreateProdutorDto = {
        nome: 'Produtor Non Existent Update',
        cpfCnpj: '10467360359',
        fazenda: 'Fazenda Non Existent',
        cidade: 'Cidade Non Existent',
        estado: 'NE',
        areaTotal: 100,
        areaAgricultavel: 50,
        areaVegetacao: 30,
        culturas: [Cultura.SOJA],
      };
      return request(app.getHttpServer())
        .put(`/produtores/${nonExistentUuid}`)
        .send(updateDto)
        .expect(404)
        .then((response) => {
          expect(response.body.message).toContain('Produtor not found');
        });
    });
  });

  describe('/produtores/:id (DELETE)', () => {
    it('should delete an existing produtor and return 204', async () => {
      expect(createdProdutorId).toBeDefined();
      await request(app.getHttpServer())
        .delete(`/produtores/${createdProdutorId}`)
        .expect(204);

      return request(app.getHttpServer())
        .get(`/produtores/${createdProdutorId}`)
        .expect(404);
    });

    it('should return 404 when trying to delete a non-existent produtor', () => {
      return request(app.getHttpServer())
        .delete(`/produtores/${nonExistentUuid}`)
        .expect(404)
        .then((response) => {
          expect(response.body.message).toContain('Produtor not found');
        });
    });
  });
});
