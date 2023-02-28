import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';

describe('Pessoas - GetAll', () => {

  let cidade_id: number | undefined = undefined;

  beforeAll(async() => {
    const resCriaCidade = await testServer
      .post('/cidades')
      .send({ nome: 'Cidade Exemplo' });
    cidade_id = resCriaCidade.body;
  });

  it('Busca todos os registros', async () => {
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

    const resBuscaPessoas = await testServer
      .get('/pessoas')
      .send();

    expect(Number(resBuscaPessoas.header['x-total-count'])).toBeGreaterThan(0);
    expect(resBuscaPessoas.statusCode).toEqual(StatusCodes.OK);
    expect(resBuscaPessoas.body.length).toBeGreaterThan(0);
  });
});