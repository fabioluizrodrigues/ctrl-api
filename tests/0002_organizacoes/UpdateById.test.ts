import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { generateCPF } from '@brazilian-utils/brazilian-utils';
import { IUsuario } from '../../src/server/database/models';
import { v4 as uuid } from 'uuid';

describe('Organizações - UpdateById', () => {

  const usuario = {
    nome: faker.name.fullName(),
    cpf: generateCPF(),
    email: faker.internet.email(),
    telefone: faker.phone.number('1199#######'),
    username: faker.internet.userName(),
    password: faker.internet.password()
  } as Omit<IUsuario, 'id'>;

  let accessToken = '';
  let organizacao_id = '';

  beforeAll(async () => {
    await testServer.post('/registrar').send(usuario);

    const signInRes = await testServer.post('/entrar').send({
      username: usuario.username,
      password: usuario.password
    });

    accessToken = signInRes.body.accessToken;

    const res1 = await testServer
      .post('/organizacoes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: faker.name.fullName()
      });
    
    organizacao_id = res1.body;
  });

  it('Atualiza registro sem token de autenticação', async () => {
    const res1 = await testServer
      .put(`/organizacoes/${uuid()}`)
      .send({
        nome: faker.name.fullName()
      });
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Atualiza registro', async () => {
    const resAtualiza = await testServer
      .put(`/organizacoes/${organizacao_id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: faker.name.fullName()
      });
    expect(resAtualiza.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Tenta atualizar registro que não exite', async () => {
    const res1 = await testServer
      .put(`/organizacoes/${uuid()}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: faker.name.fullName()
      });
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Nega atualizar registro com nome muito curto', async () => {
    const resAtualiza = await testServer
      .put(`/organizacoes/${organizacao_id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'O'
      });
    expect(resAtualiza.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resAtualiza.body).toHaveProperty('errors.body.nome');
  });

  it('Nega atualizar registro com nome vazio', async () => {
    const resAtualiza = await testServer
      .put(`/organizacoes/${organizacao_id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: '',
      });
    expect(resAtualiza.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resAtualiza.body).toHaveProperty('errors.body.nome');
  });
});