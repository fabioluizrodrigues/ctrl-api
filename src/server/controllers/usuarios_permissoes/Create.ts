import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { IUsuarioPermissao } from '../../database/models';
import { UsuariosPermissoesProvider } from '../../database/providers/usuarios_permissoes';
import { validation } from '../../shared/middleware';

interface IBodyProps extends IUsuarioPermissao { }

export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    organizacao_id: yup.string().required().uuid(),
    empresa_id: yup.string().required().uuid(),
    usuario_id: yup.string().required().uuid(),
    permissao_id: yup.string().required().uuid(),
  }))
}));

export const create = async (req: Request<{}, {}, IUsuarioPermissao>, res: Response) => {

  const result = await UsuariosPermissoesProvider.create(req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.CREATED).json(result);
};