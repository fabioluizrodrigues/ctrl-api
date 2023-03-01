import * as jwt from 'jsonwebtoken';

interface IJwtData {
  uid: number;
}

export enum TJwtErrors {
  JWT_SECRET_NOT_FOUND = 'JWT_SECRET_NOT_FOUND',
  INVALID_TOKEN = 'Token inválido.'
}

export const sign = (data: IJwtData): string | TJwtErrors => {
  if (!process.env.JWT_SECRET) return TJwtErrors.JWT_SECRET_NOT_FOUND;
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '24h' });
};

export const verify = (token: string): IJwtData | TJwtErrors => {
  if (!process.env.JWT_SECRET) return TJwtErrors.JWT_SECRET_NOT_FOUND;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded === 'string') {
      return TJwtErrors.INVALID_TOKEN;
    }
    return decoded as IJwtData;
  } catch (error) {
    return TJwtErrors.INVALID_TOKEN;
  }
};

export const JWTService = {
  sign,
  verify,
  TJwtErrors
};