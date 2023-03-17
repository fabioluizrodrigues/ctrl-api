import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { generateCPF } from '@brazilian-utils/brazilian-utils';
import { IUsuario } from '../../src/server/database/models';
import { v4 as uuid } from 'uuid';

describe('Veículos - GetById', () => {

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

  it('Busca registro por id sem token de autenticação', async () => {
    const resBusca = await testServer
      .get(`/veiculos/${uuid()}`)
      .send();
    expect(resBusca.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resBusca.body).toHaveProperty('errors.default');
  });

  it('Busca registro por id', async () => {
    const res1 = await testServer
      .post('/veiculos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        placa: 'RTL7235',
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
      .get(`/veiculos/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(resBusca.statusCode).toEqual(StatusCodes.OK);
    expect(resBusca.body).toHaveProperty('placa');
  });

  it('Tenta buscar registro que não exite', async () => {
    const res1 = await testServer
      .get(`/veiculos/${uuid()}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});