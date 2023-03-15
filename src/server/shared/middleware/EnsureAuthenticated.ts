import { StatusCodes } from 'http-status-codes';
import { JWTService, TJwtErrors } from '../services';
import { RequestHandler } from 'express';

export const ensureAuthenticated: RequestHandler = async (req, res, next) => {
  const TYPE_TOKEN = 'Bearer';
  const UNAUTHORIZED_ERROR_MESSAGE = 'Acesso negado! Email ou senha inválidos.';
  const INTERNAL_SERVER_ERROR_MESSAGE = 'Erro ao gerar o token de acesso.';

  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: { default: UNAUTHORIZED_ERROR_MESSAGE }
    });
  }

  const [type, token] = authorization.split(' ');

  if (type !== TYPE_TOKEN) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: { default: UNAUTHORIZED_ERROR_MESSAGE }
    });
  }

  const JwtData = JWTService.verify(token);

  if (JwtData === TJwtErrors.JWT_SECRET_NOT_FOUND) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: INTERNAL_SERVER_ERROR_MESSAGE }
    });
  }

  if (JwtData === TJwtErrors.INVALID_TOKEN) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: { default: UNAUTHORIZED_ERROR_MESSAGE }
    });
  }

  req.headers.usuario_id = JwtData.uid.toString();
  req.headers.organizacao_id = JwtData.oid?.toString();

  return next();
};