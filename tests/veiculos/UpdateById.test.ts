import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';

describe('Veículos - UpdateById', () => {

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

  it('Atualiza registro sem token de autenticação', async () => {
    const res1 = await testServer
      .put('/veiculos/1')
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
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Atualiza registro', async () => {
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

    const resAtualiza = await testServer
      .put(`/veiculos/${res1.body}`)
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
        observacoes: '... atualizado ...'
      });
    expect(resAtualiza.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Tenta atualizar registro que não exite', async () => {
    const res1 = await testServer
      .put('/veiculos/99999')
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
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Nega atualizar registro com placa inválida', async () => {
    const res1 = await testServer
      .post('/veiculos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        placa: 'abc0174',
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

    const resAtualiza = await testServer
      .put(`/veiculos/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        placa: 'FJX..',
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
    expect(resAtualiza.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resAtualiza.body).toHaveProperty('errors.body.placa');
  });

});