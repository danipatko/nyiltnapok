import { randstr } from '../util.server';
import config from '../../../config';
import crypto from 'crypto';

// types
type Algorithm = 'sha1' | 'sha256' | 'sha512';

interface VerificationPayload {
	email: string;
	fullname: string;
}

// defaults
const defaultAlgorithm: Algorithm = 'sha256';
const truncateLength: number = config.otpCodeLength;
const stepTime: number = config.otpValidFor; // in seconds
const algoLengths = {
	sha1: 20,
	sha256: 32,
	sha512: 64
};

// Time-based One Time Password implementation. Source: https://www.rfc-editor.org/rfc/rfc6238
export class TOTP {
	private static DIGITS_POWER: number[] = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000];

	/**
	 * @param algorithm: the crypto algorithm (HmacSHA1, HmacSHA256, HmacSHA512)
	 * @param secret: the bytes to use for the HMAC key
	 * @param text: the message or text to be authenticated
	 */
	private static hmacSha = (algorithm: Algorithm, secret: string, text: string): Buffer =>
		crypto.createHmac(algorithm, Buffer.alloc(algoLengths[algorithm], secret)).update(text).digest();

	/**
	 * This method generates a TOTP value for the given
	 * set of parameters.
	 *
	 * @param key: the shared secret, HEX encoded
	 * @param time: a value that reflects a time
	 * @param returnDigits: number of digits to return
	 * @param algorithm: the crypto function to use
	 *
	 * @return: a numeric String in base 10
	 */
	public static generateTOTP(key: string, time: string, returnDigits = 8, algorithm: Algorithm = 'sha256'): string {
		let result: string | null = null;
		while (time.length < 16) time = '0' + time;
		const hash: Buffer = TOTP.hmacSha(algorithm, key, time);

		const offset: number = hash[hash.length - 1] & 0xf;
		const binary: number =
			((hash[offset] & 0x7f) << 24) | ((hash[offset + 1] & 0xff) << 16) | ((hash[offset + 2] & 0xff) << 8) | (hash[offset + 3] & 0xff);
		const otp = binary % TOTP.DIGITS_POWER[returnDigits];

		result = otp.toString();
		while (result.length < returnDigits) result = '0' + result;

		return result;
	}
}

/**
 * Generates a new OTP code and its shared secret
 */
const getCode = (sharedSecret: string = randstr(algoLengths[defaultAlgorithm])): [string, string] => {
	const T = Math.floor(new Date().getSeconds() / stepTime);
	let steps = T.toString(16);
	while (steps.length < 16) steps = '0' + steps;

	return [TOTP.generateTOTP(sharedSecret, steps, truncateLength, defaultAlgorithm), sharedSecret];
};

const verificationOTPs = new Map<string, VerificationPayload>();

/**
 * Creates a new verification token
 * @param payload email and password of user
 * @returns {string} the shared secret
 */
const createOTP = (payload: VerificationPayload): [string, string] => {
	const [code, secret] = getCode();
	verificationOTPs.set(code, payload);
	return [code, secret];
};

/**
 * Match a user's OTP and return the payload
 * @param secret shared secret sent to the client
 * @param code verification code emailed to user
 * @retruns the payload if the code is valid
 */
const verifyOTP = (code: string, secret: string): VerificationPayload | undefined => {
	if (verificationOTPs.has(code) && getCode(secret)[0] == code) {
		const payload = verificationOTPs.get(code);
		verificationOTPs.delete(code);
		return payload;
	}
};

export { createOTP, verifyOTP };
