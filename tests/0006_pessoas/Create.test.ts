import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { generateCPF } from '@brazilian-utils/brazilian-utils';
import { IPessoa, IUsuario } from '../../src/server/database/models';

describe('Pessoas - Create', () => {

  let cidade_id: string | undefined = undefined;

  const usuario = {
    nome: faker.name.fullName(),
    cpf: generateCPF(),
    email: faker.internet.email(),
    telefone: faker.phone.number('1199#######'),
    username: faker.internet.userName(),
    password: faker.internet.password()
  } as Omit<IUsuario, 'id'>;

  let accessToken = '';

  const pessoa = {
    cnpj_cpf: generateCPF(),
    nome_razao: faker.name.fullName(),
    email: faker.internet.email(),
    telefone: faker.phone.number('1198#######'),
    ie_rg: faker.random.numeric(10),
    cep: faker.address.zipCode(),
    estado: 'MT',
    cidade_id: undefined,
    bairro: faker.random.alpha(10),
    logradouro: faker.random.alpha(10),
    numero: faker.random.numeric(2),
    complemento: '...',
    observacoes: '...'
  } as Omit<IPessoa, 'id'>;

  const pessoa2 = {
    cnpj_cpf: generateCPF(),
    nome_razao: faker.name.fullName(),
    email: faker.internet.email(),
    telefone: faker.phone.number('1199#######'),
    ie_rg: faker.random.numeric(10),
    cep: faker.address.zipCode(),
    estado: 'MT',
    cidade_id: undefined,
    bairro: faker.random.alpha(10),
    logradouro: faker.random.alpha(10),
    numero: faker.random.numeric(2),
    complemento: '...',
    observacoes: '...'
  } as Omit<IPessoa, 'id'>;

  beforeAll(async () => {

    await testServer.post('/registrar').send(usuario);

    const signInRes1 = await testServer.post('/entrar').send({
      username: usuario.username,
      password: usuario.password
    });

    accessToken = signInRes1.body.accessToken;

    const resCriaCidade = await testServer
      .post('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: faker.name.fullName() });
    cidade_id = resCriaCidade.body;


    pessoa.cidade_id = cidade_id;
    pessoa2.cidade_id = cidade_id;

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
      .post('/pessoas')
      .send(pessoa);
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Cria registro', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(pessoa);

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('string');
  });

  it(' Cria registro 2', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(pessoa2);

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('string');
  });

  it('Tenta criar registro com nome_razao muito curto', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: generateCPF(),
        nome_razao: 'A',
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

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome_razao');
  });

  it(' Tenta criar registro sem nome', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: generateCPF(),
        nome_razao: '',
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

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome_razao');
  });

  it(' Tenta criar sem cnpj_cpf', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: '',
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

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.cnpj_cpf');
  });

  it(' Tenta criar com cnpj_cpf ja existente no cadastro', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: pessoa.cnpj_cpf,
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

  it(' Tenta criar com cnpj_cpf invalido', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: '123',
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

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.cnpj_cpf');
  });

  it(' Tenta criar sem email', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: generateCPF(),
        nome_razao: faker.name.fullName(),
        email: '',
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

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });

  it(' Tenta criar com email invalido ', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: generateCPF(),
        nome_razao: faker.name.fullName(),
        email: 'email email.com',
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

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });

  it(' Tenta criar registro com email duplicado', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: generateCPF(),
        nome_razao: faker.name.fullName(),
        email: pessoa.email,
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

  it(' Tenta criar sem telefone', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: generateCPF(),
        nome_razao: faker.name.fullName(),
        email: faker.internet.email(),
        //telefone: '',
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

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.telefone');
  });

  it(' Tenta criar com telefone invalido ', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: generateCPF(),
        nome_razao: faker.name.fullName(),
        email: faker.internet.email(),
        telefone: '00',
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

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.telefone');
  });

  it(' Tenta criar com cidade_id invalido', async () => {
    const res1 = await testServer
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
        cidade_id: 'd9821',
        bairro: faker.random.alpha(10),
        logradouro: faker.random.alpha(10),
        numero: faker.random.numeric(2),
        complemento: '...',
        observacoes: '...'
      });

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Tenta criar uma registro sem enviar nenhuma propriedade', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({});

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.cnpj_cpf');
    expect(res1.body).toHaveProperty('errors.body.nome_razao');
    expect(res1.body).toHaveProperty('errors.body.email');
    expect(res1.body).toHaveProperty('errors.body.telefone');
  });

});