import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';


describe('Cidades - Create', () => {

  let accessToken = '';

  beforeAll(async () => {
    await testServer.post('/registrar').send({
      nome: 'Usuario Tester',
      cpf: '48877823062',
      email: 'tester1@email.com',
      telefone: '11999990000',
      username: 'teste1',
      password: 'teste1'
    });

    const signInRes = await testServer.post('/entrar').send({
      username: 'teste1',
      password: 'teste1'
    });

    accessToken = signInRes.body.accessToken;
  });

  it('Tenta criar registro sem token de autenticação', async () => {
    const res1 = await testServer
      .post('/cidades')
      .send({ nome: 'Caxias do Sul' });
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Cria registro', async () => {
    const res1 = await testServer
      .post('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Caxias do Sul' });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });

  it('Nega criar registro com nome muito curto', async () => {
    const res1 = await testServer
      .post('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Ca' });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });

  it('Nega criar registro com nome vazio', async () => {
    const res1 = await testServer
      .post('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: '' });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });

  it('Nega criar registro com nome maior que 150 caracteres', async () => {
    const res1 = await testServer
      .post('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome' });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });

});