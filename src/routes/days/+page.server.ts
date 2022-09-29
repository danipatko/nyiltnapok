import { invalid, redirect } from '@sveltejs/kit';
import { checkNull } from '$lib/auth/jwt';
import config from '../../../config';
import prisma from '$lib/db/client';

const getData = async (id: number) => ({
	appointments: await prisma.appointment.findMany({
		select: { id: true, label: true }
	}),
	// the appointment selected by the user
	selected: await prisma.group.findFirst({ select: { appointmentId: true }, where: { members: { some: { id } } } })
});

export const load: import('./$types').PageServerLoad = async ({ cookies }) => {
	const user = await checkNull(cookies.get('token'), false);
	if (!user) {
		throw redirect(302, '/login');
	}

	return getData(user.id);
};

export const actions: import('./$types').Actions = {
	default: async ({ request, cookies }) => {
		const user = await checkNull(cookies.get('token'), false);
		if (!user) {
			throw redirect(302, '/login');
		}

		// form validation
		let { day } = Object.fromEntries(await request.formData());
		const d = !day ? NaN : Number(day.toString());
		if (isNaN(d) || d < 0 || d > config.appointments.length) {
			return invalid(400, { msg: 'Érvénytelen időpont!' });
		}

		// id 0 cancels appointment
		if (d == 0) {
			await prisma.user.update({ data: { groupId: null }, where: { id: user.id } });
			return;
		}

		// required for email
		// const userData = await prisma.user.findFirst({ select: { groupId: true }, where: { id: user.id } });
		// if (!userData) {
		// 	return invalid(404, { msg: 'Nincs ilyen felhasználó.' });
		// }

		// get group with least members
		const g = await prisma.group.findFirst({
			select: { id: true, maxMemberCount: true, _count: { select: { members: true } } },
			where: { appointmentId: d },
			orderBy: { members: { _count: 'asc' } }
		});
		if (!g || g._count.members > g.maxMemberCount) {
			return invalid(404, { msg: 'Az időpont betelt.' });
		}

		// new
		await prisma.user.update({ data: { groupId: g.id }, where: { id: user.id } });
		// TODO: send email & rate limit

		return { selected: d };
	}
};
