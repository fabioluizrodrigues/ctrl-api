import { isValidCNPJ, isValidCPF, isValidMobilePhone } from '@brazilian-utils/brazilian-utils';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { IEmpresa } from '../../database/models';
import { EmpresasProvider } from '../../database/providers/empresas';
import { validation } from '../../shared/middleware';

interface IBodyProps extends Omit<IEmpresa, 'id' | 'organizacao_id'> { }

export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    cnpj_cpf: yup.string().required()
      .test('is-valid-cnpj-cpf', 'CNPJ/CPF inválido!',
        (value) => (isValidCNPJ(value as string) || isValidCPF(value as string))
      ),
    nome_razao: yup.string().required().min(3).max(255),
    email: yup.string().required().email(),
    telefone: yup.string().required()
      .test('is-valid-telefone', 'Telefone inválido.',
        (value) => isValidMobilePhone(value as string)
      ),
    ie_rg: yup.string().optional(),
    cep: yup.string().optional(),
    estado: yup.string().optional().min(2).max(2),
    cidade_id: yup.string().optional(),
    bairro: yup.string().optional(),
    logradouro: yup.string().optional(),
    numero: yup.string().optional(),
    complemento: yup.string().optional(),
    observacoes: yup.string().optional(),
  }))
}));

export const create = async (req: Request<{}, {}, IEmpresa>, res: Response) => {

  const empresa: Omit<IEmpresa, 'id'> = {
    organizacao_id: String(req.headers.organizacao_id),
    nome_razao: req.body.nome_razao,
    cnpj_cpf: req.body.cnpj_cpf,
    email: req.body.email,
    telefone: req.body.telefone,
    ie_rg: req.body.ie_rg,
    cep: req.body.cep,
    estado: req.body.estado,
    cidade_id: req.body.cidade_id,
    bairro: req.body.bairro,
    logradouro: req.body.logradouro,
    numero: req.body.numero,
    complemento: req.body.complemento,
    observacoes: req.body.observacoes
  };

  const result = await EmpresasProvider.create(empresa);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.CREATED).json(result);
};