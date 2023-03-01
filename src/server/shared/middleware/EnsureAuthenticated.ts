import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';


export const ensureAuthenticated: RequestHandler = async (req, res, next) => {
  const TYPE_TOKEN = 'Bearer';
  const ERROR_MESSAGE = 'Não autenticado.';

  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: { default: ERROR_MESSAGE }
    });
  }

  const [type, token] = authorization.split(' ');

  if (type !== TYPE_TOKEN) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: { default: ERROR_MESSAGE }
    });
  }

  if (token !== 'teste.teste.teste') {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: { default: ERROR_MESSAGE }
    });
  }

  return next();
};