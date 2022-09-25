import verifyToken from '$lib/auth/captcha';
import { invalid, redirect } from '@sveltejs/kit';

export const actions: import('./$types').Actions = {
	default: async ({ request }) => {
		const { 'g-recaptcha-response': token, foo } = Object.fromEntries(await request.formData());
		if (!(token && foo)) return invalid(400, { token, foo, missing: true });
		if (!(await verifyToken(token.toString()))) return invalid(403, { forbidden: true });

		throw redirect(303, '/');
	}
};
