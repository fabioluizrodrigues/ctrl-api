import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';


describe('Pessoas - Create', () => {

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

  it('Tenta criar registro sem token de autenticação', async () => {
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
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Cria registro', async () => {
    const res1 = await testServer
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
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });

  it(' Cria registro 2', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: '78763159503',
        nome_razao: 'Fulano de tal 2',
        email: 'email2@email.com',
        telefone: '11999994444',
        ie_rg: '32123131',
        cep: '78000000',
        estado: 'SP',
        cidade_id: cidade_id,
        bairro: 'bairro 1',
        logradouro: 'rua 2',
        numero: '1',
        complemento: 'casas 2',
        observacoes: '...'
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });

  it('Tenta criar registro com nome_razao muito curto', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: '54809433161',
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

  it(' Tenta criar registro sem nome', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: '68989797101',
        nome_razao: '',
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

  it(' Tenta criar sem cnpj_cpf', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: '', //sem cpf
        nome_razao: 'Fulano de tal 2',
        email: 'email2@email.com',
        telefone: '11999994444',
        ie_rg: '32123131',
        cep: '78000000',
        estado: 'SP',
        cidade_id: cidade_id,
        bairro: 'bairro 1',
        logradouro: 'rua 2',
        numero: '1',
        complemento: 'casas 2',
        observacoes: '...'
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.cnpj_cpf');
  });

  it(' Tenta criar com cnpj_cpf ja existente no cadastro', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: '63782474716', //ja existe no cadastro
        nome_razao: 'Fulano de tal 2',
        email: 'email2@email.com',
        telefone: '11999994444',
        ie_rg: '32123131',
        cep: '78000000',
        estado: 'SP',
        cidade_id: cidade_id,
        bairro: 'bairro 1',
        logradouro: 'rua 2',
        numero: '1',
        complemento: 'casas 2',
        observacoes: '...'
      });

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it(' Tenta criar com cnpj_cpf invalido', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: '12345678900', //cnpj_cpf inválido
        nome_razao: 'Fulano de tal 2',
        email: 'email2@email.com',
        telefone: '11999994444',
        ie_rg: '32123131',
        cep: '78000000',
        estado: 'SP',
        cidade_id: cidade_id,
        bairro: 'bairro 1',
        logradouro: 'rua 2',
        numero: '1',
        complemento: 'casas 2',
        observacoes: '...'
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.cnpj_cpf');
  });

  it(' Tenta criar sem email', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: '63782474716',
        nome_razao: 'Fulano de tal',
        email: '',
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
    expect(res1.body).toHaveProperty('errors.body.email');
  });

  it(' Tenta criar com email invalido ', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: '13837823504',
        nome_razao: 'Fulano de tal',
        email: 'asdasdsa', //email inválido
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
    expect(res1.body).toHaveProperty('errors.body.email');
  });

  it(' Tenta criar registro com email duplicado', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: '73957621500',
        nome_razao: 'Fulano de tal',
        email: 'email1@site.com', //email duplicado
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

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it(' Tenta criar sem telefone', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: '00916606295',
        nome_razao: 'Fulano de tal',
        email: 'email3@site.com',
        telefone: '',
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
    expect(res1.body).toHaveProperty('errors.body.telefone');
  });

  it(' Tenta criar com telefone invalido ', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: '00916606295',
        nome_razao: 'Fulano de tal',
        email: 'email3@site.com',
        telefone: '00', //telefone inválido
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
    expect(res1.body).toHaveProperty('errors.body.telefone');
  });

  it(' Tenta criar com cidade_id invalido', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cnpj_cpf: '02635165980',
        nome_razao: 'Fulano de tal',
        email: 'email4@site.com',
        telefone: '65999123234',
        ie_rg: '123456151515',
        cep: '78000000',
        estado: 'SP',
        cidade_id: '99999', //cidade_id inválido
        bairro: 'bairro do cascalho',
        logradouro: 'rua das pedras',
        numero: '123',
        complemento: 'casas 1',
        observacoes: 'observando... só olhando'
      });

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Tenta criar uma registro sem enviar nenhuma propriedade', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({});

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.cnpj_cpf');
    expect(res1.body).toHaveProperty('errors.body.nome_razao');
    expect(res1.body).toHaveProperty('errors.body.email');
    expect(res1.body).toHaveProperty('errors.body.telefone');
  });

});