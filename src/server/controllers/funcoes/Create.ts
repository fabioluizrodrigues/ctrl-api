import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { IFuncao } from '../../database/models';
import { FuncoesProvider } from '../../database/providers/funcoes';
import { validation } from '../../shared/middleware';

interface IBodyProps extends Omit<IFuncao, 'id'> { }

export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    nome: yup.string().required().min(3).max(150),
    descricao: yup.string().required().min(3).max(150),
  }))
}));

export const create = async (req: Request<{}, {}, IFuncao>, res: Response) => {

  const result = await FuncoesProvider.create(req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.CREATED).json(result);
};