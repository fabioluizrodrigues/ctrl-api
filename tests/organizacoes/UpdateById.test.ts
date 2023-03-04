import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';

describe('Organizações - UpdateById', () => {

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

  it('Atualiza registro sem token de autenticação', async () => {
    const res1 = await testServer
      .put('/organizacoes/1')
      .send({
        nome: 'Organização 1',
        usuario_adm_id: usuario_adm_id
      });
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Atualiza registro', async () => {
    const res1 = await testServer
      .post('/organizacoes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Organização 1',
        usuario_adm_id: usuario_adm_id
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualiza = await testServer
      .put(`/organizacoes/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Organização 1 - atualizado',
        usuario_adm_id: usuario_adm_id
      });
    expect(resAtualiza.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Tenta atualizar registro que não exite', async () => {
    const res1 = await testServer
      .put('/organizacoes/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Organização 1 - atualizado',
        usuario_adm_id: usuario_adm_id
      });
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Nega atualizar registro com nome muito curto', async () => {
    const res1 = await testServer
      .post('/organizacoes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Organização 1',
        usuario_adm_id: usuario_adm_id
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualiza = await testServer
      .put(`/organizacoes/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Or',
        usuario_adm_id: usuario_adm_id
      });
    expect(resAtualiza.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resAtualiza.body).toHaveProperty('errors.body.nome');
  });

  it('Nega atualizar registro com nome vazio', async () => {
    const res1 = await testServer
      .post('/organizacoes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Organização 1',
        usuario_adm_id: usuario_adm_id
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualiza = await testServer
      .put(`/organizacoes/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: '',
        usuario_adm_id: usuario_adm_id
      });
    expect(resAtualiza.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resAtualiza.body).toHaveProperty('errors.body.nome');
  });

  it('Nega atualizar registro sem usuario admin', async () => {
    const res1 = await testServer
      .post('/organizacoes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Organização 1',
        usuario_adm_id: usuario_adm_id
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualiza = await testServer
      .put(`/organizacoes/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: '',
        usuario_adm_id: ''
      });
    expect(resAtualiza.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resAtualiza.body).toHaveProperty('errors.body.usuario_adm_id');
  });

  it('Nega atualizar registro usuario admin inválido/não existente', async () => {
    const res1 = await testServer
      .post('/organizacoes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Organização 1',
        usuario_adm_id: usuario_adm_id
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualiza = await testServer
      .put(`/organizacoes/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Organização 2 - atualização',
        usuario_adm_id: '9999'
      });
    expect(resAtualiza.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(resAtualiza.body).toHaveProperty('errors.default');
  });

});