import { invalid, redirect } from '@sveltejs/kit';
import { hash } from '$lib/util.server';
import { sign } from '$lib/auth/jwt';
import prisma from '$lib/db/client';

export const actions: import('./$types').Actions = {
	default: async ({ request, cookies }) => {
		const { email, pass } = Object.fromEntries(await request.formData());
		if (!(pass && email !== undefined)) {
			return invalid(400, { msg: 'Érvénytelen bejelentkezési adatok.' });
		}

		// check users
		const user = await prisma.user.findFirst({ where: { email: email.toString(), password: hash(pass.toString()) } });
		if (!user) {
			return invalid(401, { msg: 'Hibás jelszó vagy e-mail!' });
		}

		cookies.set('token', sign({ admin: true, email: email.toString(), id: user.id }));
		throw redirect(303, '/admin');
	}
};
