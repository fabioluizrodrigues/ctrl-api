import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';

describe('Veículos - GetById', () => {

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

  it('Busca registro por id sem token de autenticação', async () => {
    const resBusca = await testServer
      .get('/veiculos/1')
      .send();
    expect(resBusca.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resBusca.body).toHaveProperty('errors.default');
  });

  it('Busca registro por id', async () => {
    const res1 = await testServer
      .post('/veiculos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        placa: 'FJX0174',
        renavam: '00544681312',
        nr_eixos: '3',
        ano_fabrica: '2013',
        ano_modelo: '2013',
        ano_exercicio: '2022',
        marca: 'volvo',
        modelo: 'FH 540',
        cor: 'branca',
        observacoes: '...'
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resBusca = await testServer
      .get(`/veiculos/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(resBusca.statusCode).toEqual(StatusCodes.OK);
    expect(resBusca.body).toHaveProperty('placa');
  });

  it('Tenta buscar registro que não exite', async () => {
    const res1 = await testServer
      .get('/veiculos/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});