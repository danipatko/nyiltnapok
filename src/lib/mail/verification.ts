import sendGrid from '@sendgrid/mail';

if (!(import.meta.env.VITE_SENDGRID_API_KEY && import.meta.env.VITE_SENDGRID_USER)) throw new Error('Cannot find sendgrid API key or authenticated user email in environment');

sendGrid.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY);

const sendVerification = async (to: string, name: string, code: string): Promise<boolean> => {
	const msg: sendGrid.MailDataRequired = {
		to,
		from: import.meta.env.VITE_SENDGRID_USER,
		subject: 'Szent László nyílt napok - erősítsd meg e-mail címedet a folytatáshoz',
		text: `Kedves ${name}! Köszönjük a jelentkezést. A következő kóddal tudod befejezni a bejelentkezést.\n${code}\nNem tudok fogalmazni mit írjak ide.`,
		html: `Kedves ${name}! Köszönjük a jelentkezést. A következő kóddal tudod befejezni a bejelentkezést.<br><b>${code}<b><br>Nem tudok fogalmazni mit írjak ide.`
	};

	return sendGrid
		.send(msg)
		.then(() => {
			console.log(`Email was successfully sent to ${name} <${to}>`);
			return true;
		})
		.catch((e) => {
			console.error(`Unable to send email to user ${name} <${to}>. Reason:\n${e}`);
			return false;
		});
};

export default sendVerification;
