import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';

describe('Cidades - GetById', () => {
  it('Busca registro por id', async () => {
    const res1 = await testServer
      .post('/cidades')
      .send({ nome: 'Caxias do Sul' });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resBusca = await testServer
      .get(`/cidades/${res1.body}`)
      .send();

    expect(resBusca.statusCode).toEqual(StatusCodes.OK);
    expect(resBusca.body).toHaveProperty('nome');
  });
  it('Tenta buscar registro que não exite', async () => {
    const res1 = await testServer
      .get('/cidades/99999')
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});