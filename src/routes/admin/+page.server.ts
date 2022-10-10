import prisma, { getGroups } from '$lib/db/client';
import { invalid, redirect } from '@sveltejs/kit';
import { check, checkNull } from '$lib/auth/jwt';
import { UserRole } from '@prisma/client';
import { hash } from '$lib/util.server';

const selectMembers = { fullname: true, email: true, lastLogin: true };

// displays
// - appointments -> groups -> group members
// - non-group members
// - admin users
export const load: import('./$types').PageServerLoad = async ({ cookies }) => {
	const user = await checkNull(cookies.get('token'), true);
	if (!user) {
		throw redirect(302, '/login');
	}

	const appointments = (await prisma.appointment.findMany({ include: { members: { select: selectMembers, orderBy: { fullname: 'asc' } } } })).map(
		(x) => ({
			...x,
			members: getGroups(x.totalMembers, x.totalGroups, x.members)
		})
	);

	const admins = await prisma.user.findMany({
		select: { email: true, fullname: true, id: true },
		where: { role: UserRole.admin }
	});

	// registered but did not apply
	const restOfUsers = await prisma.user.findMany({ select: { createdAt: true }, where: { appointmentId: null, NOT: { role: UserRole.admin } } });

	return { appointments, restOfUsers, admins };
};

// actions
// - create/delete admin users
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
		const user = await check(cookies.get('token') ?? '');
		if (!user.admin) {
			throw redirect(302, '/login');
		}
		if (user.id != 0) {
			return invalid(400, { msg: 'Csak az "admin" felhasználó törölhet más felhasználót!' });
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
	}
};
