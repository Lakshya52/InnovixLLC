import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_innovix_llc_replace_me';
const encodedKey = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  id: string;
  email: string;
  role: string;
  [key: string]: any;
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}
