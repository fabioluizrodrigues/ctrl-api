import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../../tests/jest.setup';

describe('Pessoas - GetAll', () => {

  let cidade_id: number | undefined = undefined;
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

    const resCriaCidade = await testServer
      .post('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Cidade Exemplo' });
    cidade_id = resCriaCidade.body;
  });

  it('Tenta buscar todos os registros sem token de autenticação', async () => {
    const res1 = await testServer
      .get('/pessoas')
      .send();
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Busca todos os registros', async () => {
    const resCriaPessoa = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
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
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(Number(resBuscaPessoas.header['x-total-count'])).toBeGreaterThan(0);
    expect(resBuscaPessoas.statusCode).toEqual(StatusCodes.OK);
    expect(resBuscaPessoas.body.length).toBeGreaterThan(0);
  });
});