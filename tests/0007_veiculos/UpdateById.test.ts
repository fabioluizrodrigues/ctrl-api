import { generateCPF } from '@brazilian-utils/brazilian-utils';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { v4 as uuid } from 'uuid';
import { IUsuario, IVeiculo } from '../../src/server/database/models';
import { testServer } from '../jest.setup';

describe('Veículos - UpdateById', () => {

  const usuario = {
    nome: faker.name.fullName(),
    cpf: generateCPF(),
    email: faker.internet.email(),
    telefone: faker.phone.number('1199#######'),
    username: faker.internet.userName(),
    password: faker.internet.password()
  } as Omit<IUsuario, 'id'>;

  const veiculo = {
    placa: 'RTL8987',
    renavam: faker.random.numeric(11),
    nr_eixos: 2,
    ano_fabrica: 2022,
    ano_modelo: 2023,
    ano_exercicio: 2023,
    marca: faker.random.alpha(20),
    modelo: faker.random.alpha(20),
    cor: faker.random.alpha(10),
    observacoes: faker.random.alpha(10)
  } as Omit<IVeiculo, 'id'>;

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

  it('Atualiza registro sem token de autenticação', async () => {
    const res1 = await testServer
      .put(`/veiculos/${uuid()}`)
      .send(veiculo);
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Atualiza registro', async () => {
    const res1 = await testServer
      .post('/veiculos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(veiculo);

    console.log(res1.body);

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualiza = await testServer
      .put(`/veiculos/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        placa: 'RTL7939',
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
    expect(resAtualiza.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Tenta atualizar registro que não exite', async () => {
    const res1 = await testServer
      .put(`/veiculos/${uuid()}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(veiculo);
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Nega atualizar registro com placa inválida', async () => {
    const res1 = await testServer
      .post('/veiculos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(veiculo);
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualiza = await testServer
      .put(`/veiculos/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        placa: 'RTL',
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
    expect(resAtualiza.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resAtualiza.body).toHaveProperty('errors.body.placa');
  });

});