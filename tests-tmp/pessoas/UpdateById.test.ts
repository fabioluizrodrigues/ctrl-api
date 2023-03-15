import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../../tests/jest.setup';

describe('Pessoas - UpdateById', () => {
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


  it('Tenta atualizar registro sem token de autenticação', async () => {
    const res1 = await testServer
      .put('/pessoas/1')
      .send({
        cnpj_cpf: '63782474716',
        nome_razao: 'Fulano de tal atualizado',
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
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Atualiza registro', async () => {
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

    const resAtualiza = await testServer
      .put(`/pessoas/${resCriaPessoa.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: '63782474716',
        nome_razao: 'Fulano de tal atualizado',
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

    expect(resAtualiza.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Tenta atualizar registro que não exite', async () => {
    const res1 = await testServer
      .put('/pessoas/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: '63782474716',
        nome_razao: 'Fulano de tal atualizado',
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
        observacoes: 'observando... só olhando... atualizado'
      });

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});