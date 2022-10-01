/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_PRIVATE_SECRET: string;
	readonly VITE_SENDGRID_USER: string;
	readonly VITE_SENDGRID_API_KEY: string;
	readonly VITE_RECAPTCHA_SERVER_KEY: string;
	readonly VITE_ADMIN_PASS: string;
	readonly VITE_ADMIN_MAIL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
