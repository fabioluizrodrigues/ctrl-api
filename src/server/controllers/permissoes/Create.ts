import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { IPermissao } from '../../database/models';
import { PermissoesProvider } from '../../database/providers/permissoes';
import { validation } from '../../shared/middleware';

interface IBodyProps extends Omit<IPermissao, 'id'> { }

export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    nome: yup.string().required().min(3).max(150),
    descricao: yup.string().required().min(3).max(150),
  }))
}));

export const create = async (req: Request<{}, {}, IPermissao>, res: Response) => {

  const result = await PermissoesProvider.create(req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.CREATED).json(result);
};