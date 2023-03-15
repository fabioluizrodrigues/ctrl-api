import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { IUsuarioLogin } from '../../database/models';
import { UsuariosProvider } from '../../database/providers/usuarios';
import { validation } from '../../shared/middleware';
import { JWTService, PasswordCrypto, TJwtErrors } from '../../shared/services';

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
    
    const resultOrganizacaoId = await UsuariosProvider.getOrgIdByUsuarioId(result.id);

    if (resultOrganizacaoId instanceof Error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: { default: INTERNAL_SERVER_ERROR_MESSAGE }
      });
    }

    const accessToken = JWTService.sign({
      uid: result.id,
      oid: resultOrganizacaoId
    });

    if (accessToken === TJwtErrors.JWT_SECRET_NOT_FOUND) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: { default: INTERNAL_SERVER_ERROR_MESSAGE }
      });
    }

    return res.status(StatusCodes.OK).json({ accessToken });
  }
};