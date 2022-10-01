import jwt from 'jsonwebtoken';

if (!import.meta.env.VITE_PRIVATE_SECRET) throw new Error('Cannot find VITE_PRIVATE_SECRET in environment.');
const defaultExpiry: string = '30d';

interface TokenData {
	id: number;
	admin: boolean;
	email: string;
}

const sign = (data: TokenData): string => {
	return jwt.sign(data, import.meta.env.VITE_PRIVATE_SECRET, { expiresIn: defaultExpiry });
};

const check = (token: string): Promise<TokenData> => {
	return new Promise<TokenData>((res, rej) => {
		try {
			jwt.verify(token, import.meta.env.VITE_PRIVATE_SECRET, (err, decoded) => {
				if (err) rej(`Failed to verify token. Reason:\n${err}`);
				else res(decoded as TokenData);
			});
		} catch (err) {
			rej(`Failed to verify token. Reason:\n${err}`);
		}
	});
};

const checkNull = async (token: string | undefined, admin: boolean = false): Promise<TokenData | null> => {
	return !token
		? null
		: check(token)
				.then((t) => (admin && !t.admin ? null : t))
				.catch((e) => {
					import.meta.env.DEV && console.error(e);
					return null;
				});
};

export { sign, check, checkNull };
