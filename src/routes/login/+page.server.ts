import { error, invalid, redirect } from '@sveltejs/kit';
import { sendVerification } from '$lib/mail/send';
import verifyToken from '$lib/auth/captcha';
import { createOTP } from '$lib/auth/totp';
import { validateEmail } from '$lib/util';
import config from '../../../config';

export const actions: import('./$types').Actions = {
	default: async ({ request }) => {
		// outside deadline
		if (Date.now() > config.deadline.getTime()) {
			return invalid(400, { msg: 'A jelentkezés határideje lejárt!' });
		}
		// form validation
		const { 'g-recaptcha-response': token, fullname, email } = Object.fromEntries(await request.formData());
		if (!(fullname && fullname.toString().match(/[a-zA-Zs+]{1,100}/gm))) {
			return invalid(400, { msg: 'Érvénytelen név!' });
		}
		if (!(email && validateEmail(email.toString()))) {
			return invalid(400, { msg: 'Érvénytelen vagy hiányzó email cím.' });
		}
		if (!(token && (await verifyToken(token.toString())))) {
			return invalid(400, { msg: 'Töltse ki a captcha mezőt is!' });
		}

		// create OTP
		const [code, secret] = createOTP({ email: email.toString(), fullname: fullname.toString() });

		if (import.meta.env.DEV) {
			console.log(`${fullname} <${email}> one time password: ${code} (secret: ${secret})`);
			throw redirect(303, '/verify?shared_secret=' + secret);
		} else if (await sendVerification(email.toString(), fullname.toString(), code)) {
			throw redirect(303, '/verify?shared_secret=' + secret);
		} else {
			throw error(500, 'Nem sikerült elküldeni az e-mailt.');
		}
	}
};
