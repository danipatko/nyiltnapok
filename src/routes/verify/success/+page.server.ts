import { checkNull } from '$lib/auth/jwt';
import { error } from '@sveltejs/kit';

// check if token is present
export const load: import('./$types').PageServerLoad = async ({ cookies }) => {
	const data = await checkNull(cookies.get('token'), false);
	if (data == null) {
		throw error(403, { message: 'Hiba történt. Próbálj újra bejelentkezni!' });
	}
};
