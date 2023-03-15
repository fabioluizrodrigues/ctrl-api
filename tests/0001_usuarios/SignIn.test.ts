import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { generateCPF } from '@brazilian-utils/brazilian-utils';
import { IUsuario } from '../../src/server/database/models';

describe('Usuários - SignIn', () => {

  const usuario = {
    nome: faker.name.fullName(),
    cpf: generateCPF(),
    email: faker.internet.email(),
    telefone: faker.phone.number('1199#######'),
    username: faker.internet.userName(),
    password: faker.internet.password()
  } as Omit<IUsuario, 'id'>;

  beforeAll(async () => {
    await testServer.post('/registrar').send(usuario);
  });

  it('Tenta fazer login normal', async () => {
    const res1 = await testServer.post('/entrar')
      .send({
        username: usuario.username,
        password: usuario.password
      });
    expect(res1.statusCode).toEqual(StatusCodes.OK);
    expect(res1.body).toHaveProperty('accessToken');
  });

  it('Tenta fazer login sem dados', async () => {
    const res1 = await testServer.post('/entrar')
      .send({});
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.username');
    expect(res1.body).toHaveProperty('errors.body.password');
  });

  it('Tenta fazer login sem username', async () => {
    const res1 = await testServer.post('/entrar')
      .send({
        username: '',
        password: 'usuario5'
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.username');
  });

  it('Tenta fazer login username muito curto', async () => {
    const res1 = await testServer.post('/entrar')
      .send({
        username: 'u',
        password: usuario.password
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.username');
  });

  it('Tenta fazer login username sem password', async () => {
    const res1 = await testServer.post('/entrar')
      .send({
        username: usuario.username,
        password: ''
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.password');
  });

  it('Tenta fazer login username com password muito curta', async () => {
    const res1 = await testServer.post('/entrar')
      .send({
        username: usuario.username,
        password: 'u'
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.password');
  });

});