import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { generateCPF } from '@brazilian-utils/brazilian-utils';
import { IUsuario } from '../../src/server/database/models';

describe('Usuários - SignUp', () => {

  const usuario = {
    nome: faker.name.fullName(),
    cpf: generateCPF(),
    email: faker.internet.email(),
    telefone: faker.phone.number('1199#######'),
    username: faker.internet.userName(),
    password: faker.internet.password()
  } as Omit<IUsuario, 'id'>;

  it('Registrar ususuario 1', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: faker.name.fullName(),
      cpf: generateCPF(),
      email: faker.internet.email(),
      telefone: faker.phone.number('1199#######'),
      username: faker.internet.userName(),
      password: faker.internet.password()
    });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('string');
  });

  it('Registrar ususuario 2', async () => {
    const res1 = await testServer.post('/registrar').send(usuario);
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('string');
  });

  it('Erro ao registrar um usuário sem dados', async () => {
    const res1 = await testServer.post('/registrar').send({});
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
    expect(res1.body).toHaveProperty('errors.body.cpf');
    expect(res1.body).toHaveProperty('errors.body.email');
    expect(res1.body).toHaveProperty('errors.body.telefone');
    expect(res1.body).toHaveProperty('errors.body.username');
    expect(res1.body).toHaveProperty('errors.body.password');
  });

  it('Erro ao registrar um usuário sem nome', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: '',
      cpf: generateCPF(),
      email: faker.internet.email(),
      telefone: faker.phone.number('1199#######'),
      username: faker.internet.userName(),
      password: faker.internet.password()
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });

  it('Erro ao registrar um usuário com nome muito curto', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: 'A',
      cpf: generateCPF(),
      email: faker.internet.email(),
      telefone: faker.phone.number('1199#######'),
      username: faker.internet.userName(),
      password: faker.internet.password()
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });

  it('Erro ao registrar um usuário sem cpf', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: faker.name.fullName(),
      cpf: '',
      email: faker.internet.email(),
      telefone: faker.phone.number('1199#######'),
      username: faker.internet.userName(),
      password: faker.internet.password()
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.cpf');
  });

  it('Erro ao registrar um usuário com cpf inválido', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: faker.name.fullName(),
      cpf: '123',
      email: faker.internet.email(),
      telefone: faker.phone.number('1199#######'),
      username: faker.internet.userName(),
      password: faker.internet.password()
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.cpf');
  });

  it('Erro ao registrar um usuário com cpf duplicado', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: faker.name.fullName(),
      cpf: usuario.cpf,
      email: faker.internet.email(),
      telefone: faker.phone.number('1199#######'),
      username: faker.internet.userName(),
      password: faker.internet.password()
    });
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Erro ao registrar um usuário sem email', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: faker.name.fullName(),
      cpf: generateCPF(),
      email: '',
      telefone: faker.phone.number('1199#######'),
      username: faker.internet.userName(),
      password: faker.internet.password()
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });

  it('Erro ao registrar um usuário com email invalido', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: faker.name.fullName(),
      cpf: generateCPF(),
      email: 'email email.com',
      telefone: faker.phone.number('1199#######'),
      username: faker.internet.userName(),
      password: faker.internet.password()
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });

  it('Erro ao registrar um usuário com email duplicado', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: faker.name.fullName(),
      cpf: generateCPF(),
      email: usuario.email,
      telefone: faker.phone.number('1199#######'),
      username: faker.internet.userName(),
      password: faker.internet.password()
    });
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Erro ao registrar um usuário sem telefone', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: faker.name.fullName(),
      cpf: generateCPF(),
      email: faker.internet.email(),
      telefone: '',
      username: faker.internet.userName(),
      password: faker.internet.password()
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.telefone');
  });

  it('Erro ao registrar um usuário com telefone inválido', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: faker.name.fullName(),
      cpf: generateCPF(),
      email: faker.internet.email(),
      telefone: '123',
      username: faker.internet.userName(),
      password: faker.internet.password()
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.telefone');
  });

  it('Erro ao registrar um usuário com telefone duplicado', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: faker.name.fullName(),
      cpf: generateCPF(),
      email: faker.internet.email(),
      telefone: usuario.telefone,
      username: faker.internet.userName(),
      password: faker.internet.password()
    });
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Erro ao registrar um usuário sem username', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: faker.name.fullName(),
      cpf: generateCPF(),
      email: faker.internet.email(),
      telefone: faker.phone.number('1199#######'),
      username: '',
      password: faker.internet.password()
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.username');
  });

  it('Erro ao registrar um usuário com username muito curto', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: faker.name.fullName(),
      cpf: generateCPF(),
      email: faker.internet.email(),
      telefone: faker.phone.number('1199#######'),
      username: '1',
      password: faker.internet.password()
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.username');
  });

  it('Erro ao registrar um usuário com username duplicado', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: faker.name.fullName(),
      cpf: generateCPF(),
      email: faker.internet.email(),
      telefone: faker.phone.number('1199#######'),
      username: usuario.username,
      password: faker.internet.password()
    });
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Erro ao registrar um usuário sem password', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: faker.name.fullName(),
      cpf: generateCPF(),
      email: faker.internet.email(),
      telefone: faker.phone.number('1199#######'),
      username: faker.internet.userName(),
      password: ''
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.password');
  });

  it('Erro ao registrar um usuário com password muito curta', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: faker.name.fullName(),
      cpf: generateCPF(),
      email: faker.internet.email(),
      telefone: faker.phone.number('1199#######'),
      username: faker.internet.userName(),
      password: '1'
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.password');
  });

});