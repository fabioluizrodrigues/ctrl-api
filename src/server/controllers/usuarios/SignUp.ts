import { isValidCNPJ, isValidCPF, isValidMobilePhone } from '@brazilian-utils/brazilian-utils';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { IUsuarioCreate } from '../../database/models';
import { UsuariosProvider } from '../../database/providers/usuarios';
import { validation } from '../../shared/middleware';

interface IBodyProps extends IUsuarioCreate { }

export const signUpValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    nome: yup.string().required().min(4).max(200),
    cpf: yup.string().required()
      .test(
        'is-valid-cnpj-cpf',
        'CNPJ/CPF inválido!',
        (value) => (isValidCNPJ(value as string) || isValidCPF(value as string))
      ),
    email: yup.string().required().email(),
    telefone: yup.string().required()
      .test(
        'is-valid-telefone',
        'Telefone inválido.',
        (value) => isValidMobilePhone(value as string)
      ),
    username: yup.string().required().min(3).max(100),
    password: yup.string().required().min(3).max(100),
  }))
}));

export const signUp = async (req: Request<{}, {}, IUsuarioCreate>, res: Response) => {

  const result = await UsuariosProvider.create(req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.CREATED).json(result);
};