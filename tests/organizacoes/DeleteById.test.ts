import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';

describe('Organizações - DeleteById', () => {

  let accessToken = '';
  let usuario_adm_id = 0;

  beforeAll(async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: 'Usuario Tester',
      cpf: '48877823062',
      email: 'tester1@email.com',
      telefone: '11999990000',
      username: 'teste1',
      password: 'teste1'
    });

    usuario_adm_id = res1.body;

    const signInRes = await testServer.post('/entrar').send({
      username: 'teste1',
      password: 'teste1'
    });

    accessToken = signInRes.body.accessToken;
  });

  it('Tenta apagar registro sem token de autenticação', async () => {
    const res1 = await testServer
      .delete('/organizacoes/1')
      .send();
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Apaga registro', async () => {
    const res1 = await testServer
      .post('/organizacoes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Organização 1',
        usuario_adm_id: usuario_adm_id
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resApaga = await testServer
      .delete(`/organizacoes/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(resApaga.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Tenta apagar registro que não exite', async () => {
    const res1 = await testServer
      .delete('/organizacoes/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});