if (!import.meta.env.VITE_TURNSTILE_SITEKEY || !import.meta.env.VITE_TURNSTILE_SECRETKEY)
	throw 'VITE_TURNSTILE_SITEKEY or VITE_TURNSTILE_SECRETKEY not found in environment';

/**
 * Check if a captcha token is valid or not
 */
const verifyToken = async (response: string): Promise<boolean> => {
	const body = new URLSearchParams({ secret: import.meta.env.VITE_TURNSTILE_SECRETKEY, response });
	return fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		body
	})
		.then((response) => response.json())
		.then((val) => val['success'] === true)
		.catch(() => false);
};

export default verifyToken;
