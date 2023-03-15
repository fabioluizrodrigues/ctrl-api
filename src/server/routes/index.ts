import { ensureAuthenticated } from '../shared/middleware';
import { Router } from 'express';
import {
  CidadesController,
  OrganizacoesController,
  PessoasController,
  UsuariosController,
  VeiculosController
} from '../controllers';
import { PermissoesController } from '../controllers/permissoes';
import { FuncoesController } from '../controllers/funcoes';

const router = Router();

router.get('/', (_, res) => {
  return res.send('Server running...');
});

router.get('/cidades', ensureAuthenticated, CidadesController.getAllValidation, CidadesController.getAll);
router.post('/cidades', ensureAuthenticated, CidadesController.createValidation, CidadesController.create);
router.get('/cidades/:id', ensureAuthenticated, CidadesController.getByIdValidation, CidadesController.getById);
router.put('/cidades/:id', ensureAuthenticated, CidadesController.updateByIdValidation, CidadesController.updateById);
router.delete('/cidades/:id', ensureAuthenticated, CidadesController.deleteByIdValidation, CidadesController.deleteById);

router.get('/permissoes', ensureAuthenticated, PermissoesController.getAllValidation, PermissoesController.getAll);
router.post('/permissoes', ensureAuthenticated, PermissoesController.createValidation, PermissoesController.create);
router.get('/permissoes/:id', ensureAuthenticated, PermissoesController.getByIdValidation, PermissoesController.getById);
router.put('/permissoes/:id', ensureAuthenticated, PermissoesController.updateByIdValidation, PermissoesController.updateById);
router.delete('/permissoes/:id', ensureAuthenticated, PermissoesController.deleteByIdValidation, PermissoesController.deleteById);

router.get('/funcoes', ensureAuthenticated, FuncoesController.getAllValidation, FuncoesController.getAll);
router.post('/funcoes', ensureAuthenticated, FuncoesController.createValidation, FuncoesController.create);
router.get('/funcoes/:id', ensureAuthenticated, FuncoesController.getByIdValidation, FuncoesController.getById);
router.put('/funcoes/:id', ensureAuthenticated, FuncoesController.updateByIdValidation, FuncoesController.updateById);
router.delete('/funcoes/:id', ensureAuthenticated, FuncoesController.deleteByIdValidation, FuncoesController.deleteById);

router.get('/pessoas', ensureAuthenticated, PessoasController.getAllValidation, PessoasController.getAll);
router.post('/pessoas', ensureAuthenticated, PessoasController.createValidation, PessoasController.create);
router.get('/pessoas/:id', ensureAuthenticated, PessoasController.getByIdValidation, PessoasController.getById);
router.put('/pessoas/:id', ensureAuthenticated, PessoasController.updateByIdValidation, PessoasController.updateById);
router.delete('/pessoas/:id', ensureAuthenticated, PessoasController.deleteByIdValidation, PessoasController.deleteById);

router.get('/veiculos', ensureAuthenticated, VeiculosController.getAllValidation, VeiculosController.getAll);
router.post('/veiculos', ensureAuthenticated, VeiculosController.createValidation, VeiculosController.create);
router.get('/veiculos/:id', ensureAuthenticated, VeiculosController.getByIdValidation, VeiculosController.getById);
router.put('/veiculos/:id', ensureAuthenticated, VeiculosController.updateByIdValidation, VeiculosController.updateById);
router.delete('/veiculos/:id', ensureAuthenticated, VeiculosController.deleteByIdValidation, VeiculosController.deleteById);

router.get('/organizacoes', ensureAuthenticated, OrganizacoesController.getAllValidation, OrganizacoesController.getAll);
router.post('/organizacoes', ensureAuthenticated, OrganizacoesController.createValidation, OrganizacoesController.create);
router.get('/organizacoes/:id', ensureAuthenticated, OrganizacoesController.getByIdValidation, OrganizacoesController.getById);
router.put('/organizacoes/:id', ensureAuthenticated, OrganizacoesController.updateByIdValidation, OrganizacoesController.updateById);
router.delete('/organizacoes/:id', ensureAuthenticated, OrganizacoesController.deleteByIdValidation, OrganizacoesController.deleteById);

router.post('/entrar', UsuariosController.signInValidation, UsuariosController.signIn);
router.post('/registrar', UsuariosController.signUpValidation, UsuariosController.signUp);

export { router };
