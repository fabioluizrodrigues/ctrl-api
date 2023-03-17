import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { generateCPF } from '@brazilian-utils/brazilian-utils';
import { IUsuario, IVeiculo } from '../../src/server/database/models';


describe('Veículos - Create', () => {

  const usuario = {
    nome: faker.name.fullName(),
    cpf: generateCPF(),
    email: faker.internet.email(),
    telefone: faker.phone.number('1199#######'),
    username: faker.internet.userName(),
    password: faker.internet.password()
  } as Omit<IUsuario, 'id'>;

  const veiculo = {
    placa: 'RTL1935',
    renavam: faker.random.numeric(11),
    nr_eixos: Number(faker.random.numeric()),
    ano_fabrica: Number(faker.random.numeric(4)),
    ano_modelo: Number(faker.random.numeric(4)),
    ano_exercicio: Number(faker.random.numeric(4)),
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

  it('Tenta criar registro sem token de autenticação', async () => {
    const res1 = await testServer
      .post('/veiculos')
      .send(veiculo);
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Cria registro', async () => {
    const res1 = await testServer
      .post('/veiculos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        placa: 'RTL7838',
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
    expect(typeof res1.body).toEqual('string');
  });

  it('Nega criar registro com PLACA inválida', async () => {
    const res1 = await testServer
      .post('/veiculos')
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
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.placa');
  });

  it('Nega criar registro sem placa', async () => {
    const res1 = await testServer
      .post('/veiculos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        placa: '',
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
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.placa');
  });

  it('Nega criar registro sem renavam', async () => {
    const res1 = await testServer
      .post('/veiculos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        placa: 'RTL5939',
        renavam: '',
        nr_eixos: 2,
        ano_fabrica: 2022,
        ano_modelo: 2023,
        ano_exercicio: 2023,
        marca: faker.random.alpha(20),
        modelo: faker.random.alpha(20),
        cor: faker.random.alpha(10),
        observacoes: faker.random.alpha(10)
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.renavam');
  });

  it('Nega criar registro sem numero de eixos', async () => {
    const res1 = await testServer
      .post('/veiculos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        placa: 'RTL4934',
        renavam: faker.random.numeric(11),
        ano_fabrica: Number(faker.random.numeric(4)),
        ano_modelo: Number(faker.random.numeric(4)),
        ano_exercicio: Number(faker.random.numeric(4)),
        marca: faker.random.alpha(20),
        modelo: faker.random.alpha(20),
        cor: faker.random.alpha(10),
        observacoes: faker.random.alpha(10)
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nr_eixos');
  });

  it('Nega criar registro com numero de eixos menor que 2', async () => {
    const res1 = await testServer
      .post('/veiculos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        placa: 'RTL1949',
        renavam: faker.random.numeric(11),
        nr_eixos: 1,
        ano_fabrica: Number(faker.random.numeric(4)),
        ano_modelo: Number(faker.random.numeric(4)),
        ano_exercicio: Number(faker.random.numeric(4)),
        marca: faker.random.alpha(20),
        modelo: faker.random.alpha(20),
        cor: faker.random.alpha(10),
        observacoes: faker.random.alpha(10)
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nr_eixos');
  });

});