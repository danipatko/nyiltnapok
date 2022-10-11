import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	let userid = event.cookies.get('userid');

	if (!userid) {
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		userid = crypto.randomUUID();
		event.cookies.set('userid', userid, { path: '/' });
	}
	event.locals.userid = userid;

	const requestStartTime = Date.now();
	const response = await resolve(event);

	console.info(
		`[${new Date(requestStartTime).toISOString()}] ${event.request.method} ${event.url.pathname} -> ${response.status} (${
			Date.now() - requestStartTime
		}ms)`
	);
	return response;
};
