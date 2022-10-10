import { hash } from '$lib/util.server';
import { PrismaClient, UserRole, type Appointment, type User } from '@prisma/client';
import config from '../../../config';

// TODO? not tested: may create way too many clients in dev mode

const prisma = new PrismaClient();
prisma.$connect().then(async () => {
	// create default user + appointments + groups defined in config | only runs one after db init/wipe
	import.meta.env.DEV && console.log('Creating default admin profile...');
	const { VITE_ADMIN_MAIL, VITE_ADMIN_PASS } = import.meta.env;
	if (!(VITE_ADMIN_MAIL && VITE_ADMIN_PASS))
		throw new Error(`Unable to create default admin profile: VITE_ADMIN_MAIL or VITE_ADMIN_PASS is missing from environment!`);

	if (!(await prisma.user.count({ where: { id: 0 } })))
		await prisma.user
			.create({
				data: {
					id: 0, // autoincrement starts from 1
					role: UserRole.admin,
					email: VITE_ADMIN_MAIL,
					fullname: 'admin',
					password: hash(VITE_ADMIN_PASS),
					lastNotification: new Date(0),
					createdAppointments: {
						createMany: {
							data: config.appointments.map(({ label }) => ({ label, totalGroups: config.groupCount, totalMembers: config.groupMemberCount }))
						}
					}
				}
			})
			.catch((e) => import.meta.env.DEV && console.log(e));
});

type UserWithGroup<T> = T & { group: number };

/**
 * Assigns addition group property for members having applied for an appointment
 * NOTE: members should be sorted by name's alphabetical order
 */
const addGroupToMembers = <T extends Partial<User>>(totalGroups: number, members: T[]): UserWithGroup<T>[] => {
	return members.map((x, i) => {
		return { ...x, group: Math.floor(i / totalGroups) };
	});
};

type Group = { id: number; members: Partial<User>[] };

/**
 * Gets the members organized in groups
 */
const getGroups = (totalMembers: number, totalGroups: number, members: Partial<User>[]): Group[] => {
	// number of members in one group
	return Array(totalGroups)
		.fill(null)
		.map((_, i) => {
			return { id: i, members: members.slice(i * totalMembers, (i + 1) * totalMembers) };
		});
};

export default prisma;
export { addGroupToMembers, getGroups };
