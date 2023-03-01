import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';

describe('Cidades - DeleteById', () => {

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

  it('Tenta apagar registro sem token de autenticação', async () => {
    const res1 = await testServer
      .delete('/cidades/1')
      .send();
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Apaga registro', async () => {
    const res1 = await testServer
      .post('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Caxias do Sul' });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resApaga = await testServer
      .delete(`/cidades/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(resApaga.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Tenta apagar registro que não exite', async () => {
    const res1 = await testServer
      .delete('/cidades/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});