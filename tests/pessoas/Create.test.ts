import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';


describe('Pessoas - Create', () => {

  let cidade_id: number | undefined = undefined;

  beforeAll(async() => {
    const resCriaCidade = await testServer
      .post('/cidades')
      .send({ nome: 'Cidade Exemplo' });
    cidade_id = resCriaCidade.body;
  });

  it('Cria registro', async () => {
    const res1 = await testServer
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

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });

  it('Nega criar registro com nome muito curto', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({
        cnpj_cpf: '63782474716',
        nome_razao: 'F',
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

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome_razao');
  });

});