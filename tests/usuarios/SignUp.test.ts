import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { testServer } from '../jest.setup';


describe('Usuários - SignUp', () => {

  it('Registrar ususuario 1', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: 'Usuario 1',
      cpf: '12532137045',
      email: 'usuario1@email.com',
      telefone: '11999990000',
      username: 'usuario1',
      password: 'usuario1'
    });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });

  it('Registrar ususuario 2', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: 'Usuario 2',
      cpf: '48877823062',
      email: 'usuario2@email.com',
      telefone: '11999991111',
      username: 'usuario2',
      password: 'usuario2'
    });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });

  it('Erro ao registrar um usuário sem dados', async () => {
    const res1 = await testServer.post('/registrar').send({});
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
    expect(res1.body).toHaveProperty('errors.body.cpf');
    expect(res1.body).toHaveProperty('errors.body.email');
    expect(res1.body).toHaveProperty('errors.body.telefone');
    expect(res1.body).toHaveProperty('errors.body.username');
    expect(res1.body).toHaveProperty('errors.body.password');
  });

  it('Erro ao registrar um usuário sem nome', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: '', //sem nome
      cpf: '79617588013',
      email: 'usuario3@email.com',
      telefone: '11999992222',
      username: 'usuario3',
      password: 'usuario3'
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });

  it('Erro ao registrar um usuário com nome muito curto', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: 'U', //Nome muito curto
      cpf: '79617588013',
      email: 'usuario3@email.com',
      telefone: '11999992222',
      username: 'usuario3',
      password: 'usuario3'
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });

  it('Erro ao registrar um usuário sem cpf', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: 'Usuario 3', 
      cpf: '', //sem cpf
      email: 'usuario3@email.com',
      telefone: '11999992222',
      username: 'usuario3',
      password: 'usuario3'
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.cpf');
  });

  it('Erro ao registrar um usuário com cpf inválido', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: 'Usuario 3', 
      cpf: '123', //cpf inválido
      email: 'usuario3@email.com',
      telefone: '11999992222',
      username: 'usuario3',
      password: 'usuario3'
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.cpf');
  });

  it('Erro ao registrar um usuário com cpf duplicado', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: 'Usuario 3', 
      cpf: '12532137045', //cpf dupliacado
      email: 'usuario3@email.com',
      telefone: '11999992222',
      username: 'usuario3',
      password: 'usuario3'
    });
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Erro ao registrar um usuário sem email', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: 'Usuario 3', 
      cpf: '79617588013',
      email: '', //sem email
      telefone: '11999992222',
      username: 'usuario3',
      password: 'usuario3'
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });

  it('Erro ao registrar um usuário com email invalido', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: 'Usuario 3', 
      cpf: '79617588013',
      email: 'usuario3 email.com', //email invalido
      telefone: '11999992222',
      username: 'usuario3',
      password: 'usuario3'
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });

  it('Erro ao registrar um usuário com email duplicado', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: 'Usuario 3', 
      cpf: '79617588013',
      email: 'usuario1@email.com', //email duplicado
      telefone: '11999992222',
      username: 'usuario3',
      password: 'usuario3'
    });
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Erro ao registrar um usuário sem telefone', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: 'Usuario 3', 
      cpf: '79617588013',
      email: 'usuario3@email.com', 
      telefone: '', //sem telefone
      username: 'usuario3',
      password: 'usuario3'
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.telefone');
  });

  it('Erro ao registrar um usuário com telefone inválido', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: 'Usuario 3', 
      cpf: '79617588013',
      email: 'usuario3@email.com', 
      telefone: '123', //telefone invalido
      username: 'usuario3',
      password: 'usuario3'
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.telefone');
  });

  it('Erro ao registrar um usuário com telefone duplicado', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: 'Usuario 3', 
      cpf: '79617588013',
      email: 'usuario3@email.com', 
      telefone: '11999990000', //telefone dupliacado
      username: 'usuario3',
      password: 'usuario3'
    });
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });

  it('Erro ao registrar um usuário sem username', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: 'Usuario 3', 
      cpf: '79617588013',
      email: 'usuario3@email.com', 
      telefone: '11999992222',
      username: '', //sem username
      password: 'usuario3'
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.username');
  });

  it('Erro ao registrar um usuário com username muito curto', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: 'Usuario 3', 
      cpf: '79617588013',
      email: 'usuario3@email.com', 
      telefone: '11999992222',
      username: '1', //username muito curto
      password: 'usuario3'
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.username');
  });

  it('Erro ao registrar um usuário com username duplicado', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: 'Usuario 3', 
      cpf: '79617588013',
      email: 'usuario3@email.com', 
      telefone: '11999992222',
      username: 'usuario1', //username duplicado
      password: 'usuario3'
    });
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });    

  it('Erro ao registrar um usuário sem password', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: 'Usuario 3', 
      cpf: '79617588013',
      email: 'usuario3@email.com', 
      telefone: '11999992222',
      username: 'usuario3',
      password: '' //sem password
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.password');
  });

  it('Erro ao registrar um usuário com password muito curta', async () => {
    const res1 = await testServer.post('/registrar').send({
      nome: 'Usuario 3', 
      cpf: '79617588013',
      email: 'usuario3@email.com', 
      telefone: '11999992222',
      username: 'usuario3',
      password: '1' //password muito curta
    });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.password');
  });

});