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
		html: `Kedves ${name}!<br/>Köszönjük a jelentkezést. A következő kóddal tudod befejezni a bejelentkezést.<br/><strong>${code}<strong><br/>Kérlek ne válaszolj erre az e-mailre.`
	};

	return send(to, msg);
};

const notifyAppointment = async (to: string, name: string, appointmentLabel: string): Promise<boolean> => {
	const msg: sendGrid.MailDataRequired = {
		to,
		from: import.meta.env.VITE_SENDGRID_USER,
		subject: 'Szent László nyílt napok - sikeres jelentkezés',
		text: `Kedves ${name}!\nSikeresen jelentkeztél a ${appointmentLabel} időpontra!\n\nTovábbi teendőd nincs. A regisztráció lezárulása után küldünk majd egy másik levelet a részletekkel. Ha közben szeretnél változtatni, az oldalon megteheted, viszont óránként csak egyszer, avagy legkorábban egy óra múlva, egészen a jelentkezési időszak lezárulásáig. Kérlek ne válaszolj erre az e-mailre.`,
		html: `Kedves ${name}!<br/>Sikeresen jelentkeztél a ${appointmentLabel} időpontra!<br/>További teendőd nincs. A regisztráció lezárulása után küldünk majd egy másik levelet a részletekkel. Ha közben szeretnél változtatni, az oldalon megteheted, viszont óránként csak egyszer, avagy legkorábban egy óra múlva, egészen a jelentkezési időszak lezárulásáig. Kérlek ne válaszolj erre az e-mailre.`
	};

	return send(to, msg);
};

export { sendVerification, notifyAppointment };
