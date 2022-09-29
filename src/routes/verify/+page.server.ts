import { invalid, redirect } from '@sveltejs/kit';
import { verifyOTP } from '$lib/auth/totp';
import { UserRole } from '@prisma/client';
import { sign } from '$lib/auth/jwt';
import prisma from '$lib/db/client';

export const actions: import('./$types').Actions = {
	default: async ({ request, url, cookies }) => {
		// form validation
		const { code } = Object.fromEntries(await request.formData());
		if (!(code && code.toString().length == 8)) {
			return invalid(400, { success: false, msg: 'Érvénytelen kód.' });
		}
		const sharedSecret = url.searchParams.get('shared_secret');
		if (!(sharedSecret && sharedSecret.length == 32)) {
			return invalid(400, { success: false, msg: 'Hiányzó paraméter.' });
		}

		// check otp
		const payload = verifyOTP(code.toString(), sharedSecret);
		if (!payload) {
			return invalid(401, { success: false, msg: 'A megadott kód érvénytelen vagy lejárt.' });
		}

		import.meta.env.DEV && console.log(`Successfully authenticated ${payload.fullname} <${payload.email}>`);

		// create new user or log into exising one
		let user = await prisma.user.findFirst({ where: { email: payload.email } });
		if (!user) {
			user = await prisma.user.create({ data: { email: payload.email, fullname: payload.fullname, role: UserRole.guest } });
		}

		// set header for 30 days
		cookies.set('token', sign({ admin: user.role == UserRole.admin, email: user.email, id: user.id }), {
			secure: !import.meta.env.DEV,
			maxAge: 60 * 60 * 24 * 30
		});
		throw redirect(303, '/verify/success');
	}
};
