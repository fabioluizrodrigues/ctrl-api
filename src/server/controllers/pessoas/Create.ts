import { isValidCNPJ, } from '@brazilian-utils/brazilian-utils';
import { isValidCPF } from '@brazilian-utils/brazilian-utils';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { IPessoa } from '../../database/models';
import { PessoasProvider } from '../../database/providers/pessoas';
import { validation } from '../../shared/middleware';

interface IBodyProps extends Omit<IPessoa, 'id'> { }

export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    cnpj_cpf: yup.string().required().min(11).max(14)
      .test(
        'is-valid-cnpj-cpf',
        'CNPJ/CPF inválido!',
        (value) => (isValidCNPJ(value as string) || isValidCPF(value as string))
      ),
    nome_razao: yup.string().required().min(3).max(255),
    email: yup.string().required().email(),
    telefone: yup.string().required(),
    ie_rg: yup.string().optional(),
    cep: yup.string().optional(),
    estado: yup.string().optional().min(2).max(2),
    cidade_id: yup.number().optional(),
    bairro: yup.string().optional(),
    logradouro: yup.string().optional(),
    numero: yup.string().optional(),
    complemento: yup.string().optional(),
    observacoes: yup.string().optional(),
  }))
}));

export const create = async (req: Request<{}, {}, IPessoa>, res: Response) => {

  const result = await PessoasProvider.create(req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.CREATED).json(result);
};