import crypto from 'crypto';

export const randstr = (length: number) => crypto.randomBytes(length / 2).toString('hex');
