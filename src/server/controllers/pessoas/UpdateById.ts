import { isValidCNPJ, isValidCPF } from '@brazilian-utils/brazilian-utils';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { IPessoa } from '../../database/models';
import { PessoasProvider } from '../../database/providers/pessoas';
import { validation } from '../../shared/middleware';

interface IParamProps {
  id?: number;
}

interface IBodyProps extends Omit<IPessoa, 'id'> { }

export const updateByIdValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    cnpj_cpf: yup.string().required().min(11).max(14)
      .test(
        'is-valid-cnpj-cpf',
        'CNPJ/CPF incválido!',
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
  })),
  params: getSchema<IParamProps>(yup.object().shape({
    id: yup.number().integer().required().moreThan(0)
  }))
}));

export const updateById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {

  if (!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        default: 'O parâmetro "id" precisa ser informado.'
      }
    });
  }

  const result = await PessoasProvider.updateById(req.params.id, req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.NO_CONTENT).send(result);
};