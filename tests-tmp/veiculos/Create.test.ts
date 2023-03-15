import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../../tests/jest.setup';


describe('Veículos - Create', () => {

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
      .post('/veiculos')
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

  it('Cria registro', async () => {
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
    expect(typeof res1.body).toEqual('number');
  });

  it('Nega criar registro com PLACA inválida', async () => {
    const res1 = await testServer
      .post('/veiculos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        placa: 'FJX',
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
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.placa');
  });

  it('Nega criar registro sem placa', async () => {
    const res1 = await testServer
      .post('/veiculos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        placa: '',
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
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.placa');
  });

  it('Nega criar registro sem renavam', async () => {
    const res1 = await testServer
      .post('/veiculos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        placa: 'FJX0174',
        renavam: '',
        nr_eixos: '3',
        ano_fabrica: '2013',
        ano_modelo: '2013',
        ano_exercicio: '2022',
        marca: 'volvo',
        modelo: 'FH 540',
        cor: 'branca',
        observacoes: '...'
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.renavam');
  });

  it('Nega criar registro sem numero de eixos', async () => {
    const res1 = await testServer
      .post('/veiculos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        placa: 'FJX0174',
        renavam: '00544681312',
        nr_eixos: '',
        ano_fabrica: '2013',
        ano_modelo: '2013',
        ano_exercicio: '2022',
        marca: 'volvo',
        modelo: 'FH 540',
        cor: 'branca',
        observacoes: '...'
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nr_eixos');
  });

  it('Nega criar registro com numero de eixos menor que 2', async () => {
    const res1 = await testServer
      .post('/veiculos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        placa: 'FJX0174',
        renavam: '00544681312',
        nr_eixos: '1',
        ano_fabrica: '2013',
        ano_modelo: '2013',
        ano_exercicio: '2022',
        marca: 'volvo',
        modelo: 'FH 540',
        cor: 'branca',
        observacoes: '...'
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nr_eixos');
  });

});