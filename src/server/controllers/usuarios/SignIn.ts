import { UsuariosProvider } from '../../database/providers/usuarios';
import { IUsuarioLogin } from '../../database/models';
import { validation } from '../../shared/middleware';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import * as yup from 'yup';
import { PasswordCrypto } from '../../shared/services';

interface IBodyProps extends IUsuarioLogin { }

export const signInValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    username: yup.string().required().min(3),
    password: yup.string().required().min(5),
  }))
}));

export const signIn = async (req: Request<{}, {}, IUsuarioLogin>, res: Response) => {

  const ERROR_MESSAGE = 'Acesso negado! Email ou senha inválidos.';

  const { username, password } = req.body;

  const result = await UsuariosProvider.getByUsername(username);

  if (result instanceof Error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: { default: ERROR_MESSAGE }
    });
  }

  const passwordMatch = await PasswordCrypto.verifyPassword(password, result.password);

  if (!passwordMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: { default: ERROR_MESSAGE }
    });
  } else {
    return res.status(StatusCodes.OK).json({ accessToken: 'teste.teste.teste' });
  }
};