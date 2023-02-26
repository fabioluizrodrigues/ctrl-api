import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';

describe('Cidades - UpdateById', () => {
  it('Atualiza registro', async () => {
    const res1 = await testServer
      .post('/cidades')
      .send({ nome: 'Caxias do Sul' });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualiza = await testServer
      .post(`/cidades/${res1.body}`)
      .send({ nome: 'Caxias' });

    expect(resAtualiza.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });
  it('Tenta atualizar registro que não exite', async () => {
    const res1 = await testServer
      .get('/cidades/99999')
      .send();
      
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});