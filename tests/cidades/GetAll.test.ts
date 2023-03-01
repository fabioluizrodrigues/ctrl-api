import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';

describe('Cidades - GetAll', () => {
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

  it('Tenta buscar todos os registro sem token de autenticação', async () => {
    const res1 = await testServer
      .get('/cidades')
      .send();
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Busca todos os registros', async () => {
    const res1 = await testServer
      .post('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Caxias do Sul' });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resBusca = await testServer
      .get('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(Number(resBusca.header['x-total-count'])).toBeGreaterThan(0);
    expect(resBusca.statusCode).toEqual(StatusCodes.OK);
    expect(resBusca.body.length).toBeGreaterThan(0);
  });
});