import { redirect } from '@sveltejs/kit';

export const GET: import('./$types').RequestHandler = ({ cookies }) => {
	cookies.delete('token');
	throw redirect(303, '/');
};
