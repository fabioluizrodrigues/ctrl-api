import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { generateCPF } from '@brazilian-utils/brazilian-utils';
import { IPessoa, IUsuario } from '../../src/server/database/models';
import { v4 as uuid } from 'uuid';

describe('Pessoas - UpdateById', () => {
  let cidade_id: number | undefined = undefined;

  const usuario = {
    nome: faker.name.fullName(),
    cpf: generateCPF(),
    email: faker.internet.email(),
    telefone: faker.phone.number('1199#######'),
    username: faker.internet.userName(),
    password: faker.internet.password()
  } as Omit<IUsuario, 'id'>;

  const pessoa = {
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
  } as Omit<IPessoa, 'id'>;

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
      .send({ nome: faker.internet.email() });
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


  it('Tenta atualizar registro sem token de autenticação', async () => {
    const res1 = await testServer
      .put(`/pessoas/${uuid()}`)
      .send(pessoa);
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Atualiza registro', async () => {
    const resCriaPessoa = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(pessoa);

    expect(resCriaPessoa.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualiza = await testServer
      .put(`/pessoas/${resCriaPessoa.body}`)
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

    expect(resAtualiza.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Tenta atualizar registro que não exite', async () => {
    const res1 = await testServer
      .put(`/pessoas/${uuid()}`)
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

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});