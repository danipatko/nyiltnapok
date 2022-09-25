import 'ts-jest';
import { createOTP, verifyOTP } from '../src/lib/auth/totp';

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

jest.setTimeout(65_000);

describe('TOTP authentication', () => {
	let code = '';
	let secret = '';
	const fakePerson = { email: 'example@example.com', fullname: 'John Doe' };

	test('Generate one time password', () => {
		[code, secret] = createOTP(fakePerson);
		expect(code).toHaveLength(8);
		expect(secret).toHaveLength(32);
	});

	test('Verify one time password', () => {
		expect(verifyOTP(code, secret)).toBe(fakePerson);
		expect(verifyOTP('00000000', secret)).toBeUndefined();
		expect(verifyOTP(code, 'this should not work')).toBeUndefined();
	});

	test('One time password timeout (takes a minute to complete)', async () => {
		await sleep(60_000);
		expect(verifyOTP(code, secret)).toBeUndefined();
	});
});
