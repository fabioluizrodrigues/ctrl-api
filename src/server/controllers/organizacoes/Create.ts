import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { IOrganizacao } from '../../database/models';
import { OrganizacoesProvider } from '../../database/providers/oganizacoes';
import { validation } from '../../shared/middleware';

interface IBodyProps extends Omit<IOrganizacao, 'id' | 'usuario_adm_id'> { }

export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    nome: yup.string().required().min(3).max(200)
  }))
}));

export const create = async (req: Request<{}, {}, IOrganizacao>, res: Response) => {

  const ornanizacao: Omit<IOrganizacao, 'id'> = {
    nome: req.body.nome,
    usuario_adm_id: String(req.headers.usuario_id)
  };

  const result = await OrganizacoesProvider.create(ornanizacao);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.CREATED).json(result);
};