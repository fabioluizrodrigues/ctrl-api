import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { IPermissao } from '../../database/models';
import { PermissoesProvider } from '../../database/providers/permissoes';
import { validation } from '../../shared/middleware';

interface IParamProps {
  id?: string;
}

interface IBodyProps extends Omit<IPermissao, 'id'> { }

export const updateByIdValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    nome: yup.string().required().min(3).max(150),
    descricao: yup.string().required().min(3).max(150),
  })),
  params: getSchema<IParamProps>(yup.object().shape({
    id: yup.string().required().uuid()
  }))
}));

export const updateById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {

  console.log('oi');
  
  if (!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        default: 'O parâmetro "id" precisa ser informado.'
      }
    });
  }

  const result = await PermissoesProvider.updateById(req.params.id, req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.NO_CONTENT).send(result);
};