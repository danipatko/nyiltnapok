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
		selected: await prisma.group.findFirst({ select: { appointmentId: true }, where: { members: { some: { id: user.id } } } })
	};
};

export const actions: import('./$types').Actions = {
	default: async ({ request, cookies }) => {
		const token = await checkNull(cookies.get('token'), false);
		if (!token) {
			throw redirect(302, '/login');
		}

		const user = await prisma.user.findFirst({ include: { joinedGroup: { select: { appointmentId: true } } }, where: { id: token.id } });
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
			await prisma.user.update({ data: { groupId: null }, where: { id: user.id } });
			return;
		}

		// wait cooldown time
		if (!import.meta.env.DEV && Date.now() - cooldown < user.lastNotification.getTime()) {
			return invalid(400, {
				msg: `Várj még ${((user.lastNotification.getTime() - Date.now() + cooldown) / 60 / 1000).toFixed(0)} percet mielőtt újra jelentkeznél.`,
				current: user.joinedGroup?.appointmentId ?? 0
			});
		}

		// get group with least members
		const group = await prisma.group.findFirst({
			select: { appointment: { select: { label: true } }, id: true, maxMemberCount: true, _count: { select: { members: true } } },
			where: { appointmentId: appointmentId },
			orderBy: { members: { _count: 'asc' } }
		});

		if (!group || group._count.members > group.maxMemberCount) {
			return invalid(404, { msg: 'Az időpont betelt.' });
		}

		await prisma.user.update({ data: { groupId: group.id, lastNotification: new Date() }, where: { id: user.id } });
		if (!import.meta.env.DEV) {
			notifyAppointment(user.email, user.fullname, group.appointment.label);
		}

		return { selected: appointmentId };
	}
};
