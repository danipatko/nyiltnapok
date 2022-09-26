import verifyToken from '$lib/auth/captcha';
import { createOTP } from '$lib/auth/totp';
import { validateEmail } from '$lib/util';
import { invalid, redirect } from '@sveltejs/kit';

/**
 * ACCOUNT CREATION FLOW
 *
 * 0. User fills out form && captcha
 * 1. Create TOTP session && send email
 * 2. Verify TOTP && create account && redirect
 */

export const actions: import('./$types').Actions = {
	default: async ({ request }) => {
		// form validation
		const { 'g-recaptcha-response': token, fullname, email } = Object.fromEntries(await request.formData());
		if (!(fullname && fullname.toString().match(/[a-zA-Zs+]{1,100}/gm))) {
			return invalid(400, { msg: 'Érvénytelen név!' });
		}
		if (!(email && validateEmail(email.toString()))) {
			return invalid(400, { msg: 'Érvénytelen vagy hiányzó email cím.' });
		}
		if (token && !(await verifyToken(token.toString()))) {
			return invalid(400, { msg: 'Te egy robot vagy' });
		}

		// create OTP
		const [_, secret] = createOTP({ email: email.toString(), fullname: fullname.toString() });

		// TODO: send email
		import.meta.env.DEV && console.log(`${fullname} <${email}> one time password: ${_} (secret: ${secret})`);

		throw redirect(303, '/verify?shared_secret=' + secret);
	}
};
