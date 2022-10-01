import crypto from 'crypto';

export const randstr = (length: number) => crypto.randomBytes(length / 2).toString('hex');

export const hash = (input: string) => crypto.createHash('sha256').update(input).digest('base64');
