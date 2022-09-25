/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_SENDGRID_API_KEY: string;
	readonly VITE_OTP_SECRET: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
