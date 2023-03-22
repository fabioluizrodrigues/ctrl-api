import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { IConta } from '../../database/models';
import { ContasProvider } from '../../database/providers/Contas';
import { validation } from '../../shared/middleware';

interface IBodyProps extends Omit<IConta, 'id'> { }

export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    organizacao_id: yup.string().required().uuid(),
    empresa_id: yup.string().required().uuid(),
    pessoa_id: yup.string().required().uuid(),
    descricao: yup.string().optional(),
    ativo: yup.boolean().optional().default(true),
  }))
}));

export const create = async (req: Request<{}, {}, IConta>, res: Response) => {

  const result = await ContasProvider.create(req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.CREATED).json(result);
};