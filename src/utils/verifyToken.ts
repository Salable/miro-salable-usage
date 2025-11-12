import * as jwt from 'jsonwebtoken';

export function verifyToken<T>(token: string, _secret: jwt.Secret): T | null {
  try {
    const decoded = jwt.decode(token, { complete: false });
    if (!decoded || typeof decoded !== 'object') {
      return null;
    }
    return decoded as T;
  } catch (err) {
    console.log(err);
    return null;
  }
}