import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';

describe('Organizações - Create', () => {

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

  it('Tenta criar registro sem token de autenticação', async () => {
    const res1 = await testServer
      .post('/organizacoes')
      .send({
        nome: 'Organização 1',
        usuario_adm_id: usuario_adm_id
      });
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Cria registro', async () => {
    const res1 = await testServer
      .post('/organizacoes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Organização 1',
        usuario_adm_id: usuario_adm_id
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });

  it('Nega criar registro com nome muito curto', async () => {
    const res1 = await testServer
      .post('/organizacoes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'O',
        usuario_adm_id: usuario_adm_id
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });

  it('Nega criar registro com nome vazio', async () => {
    const res1 = await testServer
      .post('/organizacoes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: '',
        usuario_adm_id: usuario_adm_id
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });

  it('Nega criar registro sem usuario admin', async () => {
    const res1 = await testServer
      .post('/organizacoes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Organização 1',
        usuario_adm_id: ''
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.usuario_adm_id');
  });

  it('Nega criar registro sem usuario admin que não existe', async () => {
    const res1 = await testServer
      .post('/organizacoes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Organização 1',
        usuario_adm_id: '99999'
      });
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

});