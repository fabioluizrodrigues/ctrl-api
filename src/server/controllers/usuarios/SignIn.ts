import { UsuariosProvider } from '../../database/providers/usuarios';
import { JWTService, PasswordCrypto, TJwtErrors } from '../../shared/services';
import { IUsuarioLogin } from '../../database/models';
import { validation } from '../../shared/middleware';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import * as yup from 'yup';

interface IBodyProps extends IUsuarioLogin { }

export const signInValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    username: yup.string().required().min(3),
    password: yup.string().required().min(5),
  }))
}));

export const signIn = async (req: Request<{}, {}, IUsuarioLogin>, res: Response) => {

  const UNAUTHORIZED_ERROR_MESSAGE = 'Acesso negado! Email ou senha inválidos.';
  const INTERNAL_SERVER_ERROR_MESSAGE = 'Erro ao gerar o token de acesso.';

  const { username, password } = req.body;

  const result = await UsuariosProvider.getByUsername(username);

  if (result instanceof Error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: { default: UNAUTHORIZED_ERROR_MESSAGE }
    });
  }

  const passwordMatch = await PasswordCrypto.verifyPassword(password, result.password);

  if (!passwordMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: { default: UNAUTHORIZED_ERROR_MESSAGE }
    });
  } else {

    const accessToken = JWTService.sign({ uid: result.id });

    if (accessToken === TJwtErrors.JWT_SECRET_NOT_FOUND) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: { default: INTERNAL_SERVER_ERROR_MESSAGE }
      });
    }

    return res.status(StatusCodes.OK).json({ accessToken });
  }
};