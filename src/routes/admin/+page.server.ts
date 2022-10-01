import { invalid, redirect } from '@sveltejs/kit';
import { checkNull } from '$lib/auth/jwt';
import config from '../../../config';
import prisma from '$lib/db/client';
import { UserRole } from '@prisma/client';
import { hash } from '$lib/util.server';

const selectMembers = { select: { fullname: true, email: true, lastLogin: true } };
const selectGroups = { select: { id: true, maxMemberCount: true, members: selectMembers } };

// displays
// - appointments -> groups -> group members
// - non-group members
// - admin users
export const load: import('./$types').PageServerLoad = async ({ cookies }) => {
	const user = await checkNull(cookies.get('token'), true);
	if (!user) {
		throw redirect(302, '/login');
	}

	const appointments = await prisma.appointment.findMany({
		include: { groups: selectGroups }
	});
	const admins = await prisma.user.findMany({
		select: { email: true, fullname: true, id: true },
		where: { role: UserRole.admin }
	});
	// registered but did not apply
	const restOfUsers = await prisma.user.findMany({ select: { createdAt: true }, where: { groupId: null, NOT: { role: UserRole.admin } } });

	return { appointments, restOfUsers, admins };
};

// actions
// - create/delete admin users
// - create/delete/update groups
// - create/delete/update appointments
export const actions: import('./$types').Actions = {
	// create a new user: returns the generated user's data
	createuser: async ({ cookies, request }) => {
		if (!(await checkNull(cookies.get('token'), true))) {
			throw redirect(302, '/login');
		}

		const { email, pass, fullname } = Object.fromEntries(await request.formData());
		if (!(email && pass && fullname)) {
			return invalid(400, { msg: 'Hiányzó email, jelszó vagy név!' });
		}

		return prisma.user
			.create({
				select: { email: true, fullname: true, id: true },
				data: {
					email: email.toString(),
					password: hash(pass.toString()),
					fullname: fullname.toString(),
					role: UserRole.admin,
					lastNotification: new Date(0)
				}
			})
			.catch(() => {
				console.error('Failed to create user with duplicate email address.');
				return invalid(400, { msg: 'Hibás email cím' });
			});
	},
	// delete a user
	deleteuser: async ({ request, cookies }) => {
		if (!(await checkNull(cookies.get('token'), true))) {
			throw redirect(302, '/login');
		}

		const id = (await request.formData()).get('id');
		if (!id || isNaN(Number(id))) {
			return invalid(400, { msg: 'Hiányzó ID!' });
		}

		const { count } = await prisma.user.deleteMany({ where: { id: Number(id), NOT: { email: import.meta.env.VITE_ADMIN_MAIL } } });
		if (count != 1) {
			return invalid(400, { msg: 'Ez a felhasználó nem törölhető!' });
		}
		return { id };
	},
	// create new group
	creategroup: async ({ request, cookies }) => {
		const user = await checkNull(cookies.get('token'), true);
		if (!user) {
			throw redirect(302, '/login');
		}

		const { id, max } = Object.fromEntries(await request.formData());
		const appointmentId = !id ? NaN : Number(id.toString());
		const maxMemberCount = !max ? NaN : Number(max.toString());

		if (isNaN(appointmentId) || isNaN(maxMemberCount)) {
			return invalid(400, { msg: 'Hiányzó ID vagy létszám!' });
		}

		const res = await prisma.group.create({ ...selectGroups, data: { appointmentId, maxMemberCount, creatorId: user.id } }).catch(() => null);
		return res ?? invalid(400, { msg: 'Nem sikerült létrehozni a csoportot!' });
	},
	// create new group
	deletegroup: async ({ request, cookies }) => {
		if (!(await checkNull(cookies.get('token'), true))) {
			throw redirect(302, '/login');
		}

		const { id } = Object.fromEntries(await request.formData());
		const gid = !id ? NaN : Number(id.toString());

		if (isNaN(gid)) {
			return invalid(400, { msg: 'Hiányzó ID!' });
		}

		const group = await prisma.group.delete({ where: { id: gid } }).catch(() => null);
		return group ? { id: group.id } : invalid(400, { msg: 'Nem sikerült törölni a csoportot!' });
	}
};
