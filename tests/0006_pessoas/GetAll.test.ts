import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { generateCPF } from '@brazilian-utils/brazilian-utils';
import { IUsuario } from '../../src/server/database/models';

describe('Pessoas - GetAll', () => {

  let cidade_id: number | undefined = undefined;

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

    const resCriaCidade = await testServer
      .post('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: faker.name.fullName() });
    cidade_id = resCriaCidade.body;

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

  it('Tenta buscar todos os registros sem token de autenticação', async () => {
    const res1 = await testServer
      .get('/pessoas')
      .send();
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Busca todos os registros', async () => {
    const resCriaPessoa = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: generateCPF(),
        nome_razao: faker.name.fullName(),
        email: faker.internet.email(),
        telefone: faker.phone.number('1199#######'),
        ie_rg: faker.random.numeric(10),
        cep: faker.address.zipCode(),
        estado: 'MT',
        cidade_id: cidade_id,
        bairro: faker.random.alpha(10),
        logradouro: faker.random.alpha(10),
        numero: faker.random.numeric(2),
        complemento: '...',
        observacoes: '...'
      });

    expect(resCriaPessoa.statusCode).toEqual(StatusCodes.CREATED);

    const resBuscaPessoas = await testServer
      .get('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(Number(resBuscaPessoas.header['x-total-count'])).toBeGreaterThan(0);
    expect(resBuscaPessoas.statusCode).toEqual(StatusCodes.OK);
    expect(resBuscaPessoas.body.length).toBeGreaterThan(0);
  });
});