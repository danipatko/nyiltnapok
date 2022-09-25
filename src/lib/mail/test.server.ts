import sendGrid from '@sendgrid/mail';

if (!import.meta.env.VITE_SENDGRID_API_KEY) throw new Error('Cannot find sendgrid api key in environment');

sendGrid.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY);

// const msg: sendGrid.MailDataRequired = {
// 	to: 'varga.benedek.20f@szlgbp.hu',
// 	from: 'p8.dani@gmail.com',
// 	subject: 'I Like Watching Videos Of Black Men Shaking Their Booty Cheeks...',
// 	text: 'copypasta',
// 	html: 'copypasta'
// };

// sendGrid
// 	.send(msg)
// 	.then(() => {
// 		console.log('Email sent');
// 	})
// 	.catch((error) => {
// 		console.error(error);
// 	});

export default 1;
