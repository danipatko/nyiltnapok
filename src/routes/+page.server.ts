import { error } from '@sveltejs/kit';
// import mail from '$lib/mail/test.server';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }: any) {
	throw error(404, 'Not found');
}
