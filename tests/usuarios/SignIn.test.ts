import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';


describe('Usuários - SignIn', () => {

  beforeAll(async () => {
    await testServer.post('/registrar').send({
      nome: 'Usuario 5',
      cpf: '03162028000',
      email: 'usuario5@email.com',
      telefone: '11999995555',
      username: 'usuario5',
      password: 'usuario5'
    });
  });

  it('Tenta fazer login normal', async () => {
    const res1 = await testServer.post('/entrar')
      .send({
        username: 'usuario5',
        password: 'usuario5'
      });
    expect(res1.statusCode).toEqual(StatusCodes.OK);
    expect(res1.body).toHaveProperty('accessToken');
  });

  it('Tenta fazer login sem dados', async () => {
    const res1 = await testServer.post('/entrar')
      .send({});
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.username');
    expect(res1.body).toHaveProperty('errors.body.password');
  });

  it('Tenta fazer login sem username', async () => {
    const res1 = await testServer.post('/entrar')
      .send({
        username: '',
        password: 'usuario5'
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.username');
  });

  it('Tenta fazer login username muito curto', async () => {
    const res1 = await testServer.post('/entrar')
      .send({
        username: 'u',
        password: 'usuario5'
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.username');
  });

  it('Tenta fazer login username sem password', async () => {
    const res1 = await testServer.post('/entrar')
      .send({
        username: 'usuario5',
        password: ''
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.password');
  });

  it('Tenta fazer login username com password muito curta', async () => {
    const res1 = await testServer.post('/entrar')
      .send({
        username: 'usuario5',
        password: 'u'
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.password');
  });

});