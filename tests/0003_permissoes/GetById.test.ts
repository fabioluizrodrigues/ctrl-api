import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { generateCPF } from '@brazilian-utils/brazilian-utils';
import { IUsuario } from '../../src/server/database/models';
import { v4 as uuid } from 'uuid';

describe('Permissões - GetById', () => {

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

  it('Busca registro por id sem token de autenticação', async () => {
    const resBusca = await testServer
      .get(`/permissoes/${uuid()}`)
      .send();
    expect(resBusca.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resBusca.body).toHaveProperty('errors.default');
  });

  it('Busca registro por id', async () => {
    const res1 = await testServer
      .post('/permissoes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ 
        nome: faker.datatype.uuid(),
        descricao: faker.name.fullName()
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resBusca = await testServer
      .get(`/permissoes/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(resBusca.statusCode).toEqual(StatusCodes.OK);
    expect(resBusca.body).toHaveProperty('nome');
  });

  it('Tenta buscar registro que não exite', async () => {
    const res1 = await testServer
      .get(`/permissoes/${uuid()}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});