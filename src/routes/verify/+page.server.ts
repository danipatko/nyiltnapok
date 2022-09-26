import { verifyOTP } from '$lib/auth/totp';
import { invalid, redirect } from '@sveltejs/kit';

export const actions: import('./$types').Actions = {
	default: async ({ request, url }) => {
		// form validation
		const { code } = Object.fromEntries(await request.formData());
		if (!(code && code.toString().length == 8)) {
			return invalid(400, { code, malformed: true });
		}
		const sharedSecret = url.searchParams.get('shared_secret');
		if (!(sharedSecret && sharedSecret.length == 32)) {
			return invalid(400, { sharedSecret, malformed: true });
		}

		// check otp
		const payload = verifyOTP(code.toString(), sharedSecret);
		if (!payload) {
			return invalid(401, { code, invalid: true });
		}

		import.meta.env.DEV && console.log(`Successfully authenticated ${payload.fullname} <${payload.email}>`);
		// TODO: create user record in db

		throw redirect(303, '/');
	}
};
