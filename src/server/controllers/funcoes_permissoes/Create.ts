import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { IFuncaoPermissao } from '../../database/models';
import { FuncoesPermissoesProvider } from '../../database/providers/funcoes_permissoes';
import { validation } from '../../shared/middleware';

interface IBodyProps extends IFuncaoPermissao { }

export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    organizacao_id: yup.string().required().uuid(),
    empresa_id: yup.string().required().uuid(),
    funcao_id: yup.string().required().uuid(),
    permissao_id: yup.string().required().uuid(),
  }))
}));

export const create = async (req: Request<{}, {}, IFuncaoPermissao>, res: Response) => {

  const result = await FuncoesPermissoesProvider.create(req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.CREATED).json(result);
};