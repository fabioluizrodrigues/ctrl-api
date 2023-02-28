import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';

describe('Pessoas - GetById', () => {

  let cidade_id: number | undefined = undefined;

  beforeAll(async() => {
    const resCriaCidade = await testServer
      .post('/cidades')
      .send({ nome: 'Cidade Exemplo' });
    cidade_id = resCriaCidade.body;
  });

  it('Busca registro por id', async () => {
    const resCriaPessoa = await testServer
      .post('/pessoas')
      .send({
        cnpj_cpf: '63782474716',
        nome_razao: 'Fulano de tal',
        email: 'email1@site.com',
        telefone: '66999991234',
        ie_rg: '123456151515',
        cep: '78000000',
        estado: 'SP',
        cidade_id: cidade_id,
        bairro: 'bairro do cascalho',
        logradouro: 'rua das pedras',
        numero: '123',
        complemento: 'casas 1',
        observacoes: 'observando... só olhando'
      });

    expect(resCriaPessoa.statusCode).toEqual(StatusCodes.CREATED);

    const resBusca = await testServer
      .get(`/pessoas/${resCriaPessoa.body}`)
      .send();

    expect(resBusca.statusCode).toEqual(StatusCodes.OK);
    expect(resBusca.body).toHaveProperty('id');
  });

  it('Tenta buscar registro que não exite', async () => {
    const res1 = await testServer
      .get('/pessoas/99999')
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});