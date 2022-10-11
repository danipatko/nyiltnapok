import verifyToken from '$lib/auth/captcha';
import { createOTP } from '$lib/auth/totp';
import client from '$lib/db/client';
import { sendVerification } from '$lib/mail/send';
import { validateEmail } from '$lib/util';
import { error, invalid, redirect } from '@sveltejs/kit';
import config from '../../../config';

export const actions: import('./$types').Actions = {
	default: async ({ request }) => {
		// outside deadline
		if (!import.meta.env.DEV && Date.now() > config.deadline.getTime()) {
			return invalid(400, { msg: 'A jelentkezés határideje lejárt!' });
		}
		if (!import.meta.env.DEV && Date.now() < config.startDate.getTime()) {
			return invalid(400, { msg: 'A jelentkezés még nem kezdődött el!' });
		}

		// form validation
		const { 'cf-turnstile-response': token, fullname, email, stage } = Object.fromEntries(await request.formData());
		import.meta.env.DEV && console.debug({ stage });

		if (!(email && validateEmail(email.toString()))) {
			return invalid(400, { msg: 'Érvénytelen vagy hiányzó email cím.' });
		}

		// register user
		if (stage == '0') {
			const res = await client.user.count({ where: { email: `${email}` } });
			if (res !== 1) return 'continue';
		}
		// continue validation
		else if (!fullname || !fullname.toString().match(/[a-zA-Z\s+]{1,100}/gm)) {
			return invalid(400, { msg: 'Érvénytelen név!' });
		}

		if (!import.meta.env.DEV && !(token && (await verifyToken(token.toString())))) {
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
