import { generateCPF } from '@brazilian-utils/brazilian-utils';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { IUsuario } from '../../src/server/database/models';
import { testServer } from '../jest.setup';

describe('Veículos - GetAll', () => {

  const usuario = {
    nome: faker.name.fullName(),
    cpf: generateCPF(),
    email: faker.internet.email(),
    telefone: faker.phone.number('1199#######'),
    username: faker.internet.userName(),
    password: faker.internet.password()
  } as Omit<IUsuario, 'id'>;

  let accessToken = '';

  beforeAll(async () => {
    await testServer.post('/registrar').send(usuario);

    const signInRes = await testServer.post('/entrar').send({
      username: usuario.username,
      password: usuario.password
    });

    accessToken = signInRes.body.accessToken;

    await testServer
      .post('/organizacoes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: faker.name.fullName() });

    const signInRes2 = await testServer.post('/entrar').send({
      username: usuario.username,
      password: usuario.password
    });

    accessToken = signInRes2.body.accessToken;
  });

  it('Tenta buscar todos os registro sem token de autenticação', async () => {
    const res1 = await testServer
      .get('/veiculos')
      .send();
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Busca todos os registros', async () => {
    const res1 = await testServer
      .post('/veiculos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        placa: 'RTL7435',
        renavam: faker.random.numeric(11),
        nr_eixos: 2,
        ano_fabrica: 2022,
        ano_modelo: 2023,
        ano_exercicio: 2023,
        marca: faker.random.alpha(20),
        modelo: faker.random.alpha(20),
        cor: faker.random.alpha(10),
        observacoes: faker.random.alpha(10)
      });

    console.log(res1.body);
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resBusca = await testServer
      .get('/veiculos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(Number(resBusca.header['x-total-count'])).toBeGreaterThan(0);
    expect(resBusca.statusCode).toEqual(StatusCodes.OK);
    expect(resBusca.body.length).toBeGreaterThan(0);
  });
});