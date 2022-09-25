if (!import.meta.env.VITE_RECAPTCHA_SERVER_KEY) throw new Error('Unable to find VITE_RECAPTCHA_SERVER_KEY in environment.');

/**
 * Check if a captcha token is valid or not
 */
const verifyToken = async (response: string): Promise<boolean> => {
	const params = new URLSearchParams({ secret: import.meta.env.VITE_RECAPTCHA_SERVER_KEY, response });
	return fetch('https://www.google.com/recaptcha/api/siteverify?' + params.toString(), { method: 'POST' })
		.then((response) => response.json())
		.then((val) => val['success'] === true)
		.catch(() => false);
};

export default verifyToken;
