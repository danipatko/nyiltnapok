import sendGrid from '@sendgrid/mail';

if (!(import.meta.env.VITE_SENDGRID_API_KEY && import.meta.env.VITE_SENDGRID_USER))
	throw new Error('Cannot find sendgrid API key or authenticated user email in environment');

sendGrid.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY);

const send = (to: string, msg: sendGrid.MailDataRequired): Promise<boolean> =>
	sendGrid
		.send(msg)
		.then(() => {
			console.log(`Email was successfully sent to <${to}>`);
			return true;
		})
		.catch((e) => {
			console.error(`Unable to send email to user <${to}>. Reason:\n${e}`);
			return false;
		});

const sendVerification = async (to: string, name: string, code: string): Promise<boolean> => {
	const msg: sendGrid.MailDataRequired = {
		to,
		from: import.meta.env.VITE_SENDGRID_USER,
		subject: 'Szent László nyílt napok - erősítsd meg e-mail címedet a folytatáshoz',
		text: `Kedves ${name}!\nKöszönjük a jelentkezést. A következő kóddal tudod befejezni a bejelentkezést.\n${code}\n\nKérlek ne válaszolj erre az e-mailre.`,
		html: `Kedves ${name}!<br>Köszönjük a jelentkezést. A következő kóddal tudod befejezni a bejelentkezést.<br><b>${code}<b><br>Kérlek ne válaszolj erre az e-mailre.`
	};

	return send(to, msg);
};

const notifyAppointment = async (to: string, name: string, appointmentLabel: string): Promise<boolean> => {
	const msg: sendGrid.MailDataRequired = {
		to,
		from: import.meta.env.VITE_SENDGRID_USER,
		subject: 'Szent László nyílt napok - erősítsd meg e-mail címedet a folytatáshoz',
		text: `Kedves ${name}!\nSikeres jelentkezés a ${appointmentLabel} időpontra! Ne késs vagy nem tudom. \n\nKérlek ne válaszolj erre az e-mailre.`,
		html: `Kedves ${name}!<br>Sikeres jelentkezés a ${appointmentLabel} időpontra! Ne késs vagy nem tudom. <br>Kérlek ne válaszolj erre az e-mailre.`
	};

	return send(to, msg);
};

export { sendVerification, notifyAppointment };
