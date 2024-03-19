import { nanoid } from 'nanoid';
import { verify, sign } from 'jsonwebtoken';

export function extractJWT<T = unknown>(token: string, secretKey = ''): T {
  return verify(token, secretKey || process.env.JWT_SECRET) as T;
}

interface IGenTokenParams {
  jti?: string;
  secretKey?: string;
  exp?: number | string;
  algorithm?: 'HS256' | 'HS512';
  payload: Record<string, string>;
}

export function genToken({
  exp,
  jti,
  payload,
  secretKey,
  algorithm = 'HS256',
}: IGenTokenParams): string {
  exp ||= 60 * 60;
  jti ||= nanoid(20);

  return sign(
    {
      ...payload,
      jti,
    },
    secretKey || process.env.JWT_SECRET,
    {
      algorithm,
      expiresIn: exp,
    },
  );
}
