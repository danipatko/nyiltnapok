import { UserRole } from '@prisma/client';
import { verifyOTP } from '$lib/auth/totp';
import { invalid } from '@sveltejs/kit';
import prisma from '$lib/db/client';

export const actions: import('./$types').Actions = {
	default: async ({ request, url }) => {
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

		const user = await prisma.user.findFirst({ where: { email: payload.email } });
		if (!user) {
			// create new user
			// szlg domain -> guide, can be later promoted to admin : guest
			await prisma.user.create({ data: { email: payload.email, fullname: payload.fullname, role: payload.email.endsWith('@szlgbp.hu') ? UserRole.guide : UserRole.guest } });
		}

		// TODO: return user data, sign cookie and set shared state for client
		return invalid(200, { success: true, msg: '' });
	}
};
