import { NextFunction, Request, Response } from 'express';

export function can(permissoes: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {

    const usuario_id = req.headers.usuario_id;
    const organizacao_id = req.headers.organizacao_id;

    console.log('permissoes', permissoes);

    console.log('usuario_id', usuario_id);
    console.log('organizacao_id', organizacao_id);

    return next();
  };
}

export function is(permissoes: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {

    const usuario_id = req.headers.usuario_id;
    const organizacao_id = req.headers.organizacao_id;

    console.log('permissoes', permissoes);

    console.log('usuario_id', usuario_id);
    console.log('organizacao_id', organizacao_id);

    return next();
  };
}

export const Permission = {
  can,
  is
};