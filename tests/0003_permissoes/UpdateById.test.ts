import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../../tests/jest.setup';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { generateCPF } from '@brazilian-utils/brazilian-utils';
import { IUsuario } from '../../src/server/database/models';
import { v4 as uuid } from 'uuid';

describe('Permissões - UpdateById', () => {

  const usuario = {
    nome: faker.name.fullName(),
    cpf: generateCPF(),
    email: faker.internet.email(),
    telefone: faker.phone.number('1199#######'),
    username: faker.internet.userName(),
    password: faker.internet.password()
  } as Omit<IUsuario, 'id'>;

  let accessToken = '';

  beforeAll(async () => {
    await testServer.post('/registrar').send(usuario);

    const signInRes = await testServer.post('/entrar').send({
      username: usuario.username,
      password: usuario.password
    });

    accessToken = signInRes.body.accessToken;
  });

  it('Atualiza registro sem token de autenticação', async () => {
    const res1 = await testServer
      .put(`/permissoes/${uuid()}`)
      .send({ 
        nome: faker.datatype.uuid(),
        descricao: faker.name.fullName()
      });
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Atualiza registro', async () => {
    const res1 = await testServer
      .post('/permissoes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ 
        nome: faker.datatype.uuid(),
        descricao: faker.name.fullName()
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualiza = await testServer
      .put(`/permissoes/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ 
        nome: faker.datatype.uuid(),
        descricao: faker.name.fullName()
      });
    expect(resAtualiza.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Tenta atualizar registro que não exite', async () => {
    const res1 = await testServer
      .put(`/permissoes/${uuid()}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ 
        nome: faker.datatype.uuid(),
        descricao: faker.name.fullName()
      });
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Nega atualizar registro com nome muito curto', async () => {
    const res1 = await testServer
      .post('/permissoes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ 
        nome: faker.datatype.uuid(),
        descricao: faker.name.fullName()
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualiza = await testServer
      .put(`/permissoes/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ 
        nome: 'a',
        descricao: faker.name.fullName()
      });
    expect(resAtualiza.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resAtualiza.body).toHaveProperty('errors.body.nome');
  });

  it('Nega atualizar registro com nome maior que 150 caracteres', async () => {
    const res1 = await testServer
      .post('/permissoes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ 
        nome: faker.datatype.uuid(),
        descricao: faker.name.fullName()
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualiza = await testServer
      .put(`/permissoes/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ 
        nome: faker.datatype.uuid() + faker.datatype.uuid() + faker.datatype.uuid() + faker.datatype.uuid() + faker.datatype.uuid() + faker.datatype.uuid(),
        descricao: faker.name.fullName()
      });
    expect(resAtualiza.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resAtualiza.body).toHaveProperty('errors.body.nome');
  });
});