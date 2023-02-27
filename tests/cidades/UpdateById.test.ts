import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';

describe('Cidades - UpdateById', () => {
  it('Atualiza registro', async () => {
    const res1 = await testServer
      .post('/cidades')
      .send({ nome: 'Caxias do Sul' });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualiza = await testServer
      .put(`/cidades/${res1.body}`)
      .send({ nome: 'Caxias' });

    expect(resAtualiza.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Tenta atualizar registro que não exite', async () => {
    const res1 = await testServer
      .put('/cidades/99999')
      .send({ nome: 'Caxias' });

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Nega atualizar registro com nome muito curto', async () => {
    const res1 = await testServer
      .post('/cidades')
      .send({ nome: 'Caxias do Sul' });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualiza = await testServer
      .put(`/cidades/${res1.body}`)
      .send({ nome: 'Ca' });

    expect(resAtualiza.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resAtualiza.body).toHaveProperty('errors.body.nome');
  });

  it('Nega atualizar registro com nome maior que 150 caracteres', async () => {
    const res1 = await testServer
      .post('/cidades')
      .send({ nome: 'Caxias do Sul' });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualiza = await testServer
      .put(`/cidades/${res1.body}`)
      .send({ nome: 'Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome Nome nome' });

    expect(resAtualiza.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resAtualiza.body).toHaveProperty('errors.body.nome');
  });
});