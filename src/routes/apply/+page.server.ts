import { invalid, redirect } from '@sveltejs/kit';
import { checkNull } from '$lib/auth/jwt';
import config from '../../../config';
import prisma from '$lib/db/client';
import { notifyAppointment } from '$lib/mail/send';

// in seconds (getTime)
const cooldown = config.appointmentCooldown * 60 * 60 * 1000;

export const load: import('./$types').PageServerLoad = async ({ cookies }) => {
	const user = await checkNull(cookies.get('token'), false);
	if (!user) {
		throw redirect(302, '/login');
	}

	return {
		// appointmentMaxSlots: await prisma.group.groupBy({ by: ['appointmentId'], _sum: { maxMemberCount: true } }),
		appointments: await prisma.appointment.findMany({
			select: { /*groups: { select: { _count: { select: { members: true } } } },*/ id: true, label: true }
		}),
		// the appointment selected by the user
		selected: await prisma.user.findFirst({ select: { appointmentId: true }, where: { id: user.id } })
	};
};

export const actions: import('./$types').Actions = {
	default: async ({ request, cookies }) => {
		const token = await checkNull(cookies.get('token'), false);
		if (!token) {
			throw redirect(302, '/login');
		}

		const user = await prisma.user.findFirst({ where: { id: token.id } });
		if (!user) {
			throw redirect(302, '/login');
		}

		// form validation
		const { day } = Object.fromEntries(await request.formData());
		const appointmentId = !day ? NaN : Number(day.toString());
		if (isNaN(appointmentId) || appointmentId < 0 || appointmentId > config.appointments.length) {
			return invalid(400, { msg: 'Érvénytelen időpont!' });
		}

		// outside deadline
		if (Date.now() > config.deadline.getTime()) {
			return invalid(400, { msg: 'A jelentkezés határideje lejárt!' });
		}

		// id 0 cancels appointment
		if (appointmentId == 0) {
			await prisma.user.update({ data: { appointmentId: null }, where: { id: user.id } });
			return;
		}

		// wait cooldown time
		if (!import.meta.env.DEV && Date.now() - cooldown < user.lastNotification.getTime()) {
			return invalid(400, {
				msg: `Várj még ${((user.lastNotification.getTime() - Date.now() + cooldown) / 60 / 1000).toFixed(0)} percet mielőtt újra jelentkeznél.`,
				current: user.appointmentId ?? 0
			});
		}

		// get group with least members

		const appointment = await prisma.appointment.findFirst({
			select: { totalMembers: true, label: true, _count: { select: { members: true } } },
			where: { id: appointmentId }
		});
		if (!appointment || appointment._count.members > appointment.totalMembers) {
			return invalid(404, { msg: 'Az időpont betelt.' });
		}

		await prisma.user.update({ data: { appointmentId: appointmentId, lastNotification: new Date() }, where: { id: user.id } });
		if (!import.meta.env.DEV) {
			notifyAppointment(user.email, user.fullname, appointment.label);
		}

		return { selected: appointmentId };
	}
};
