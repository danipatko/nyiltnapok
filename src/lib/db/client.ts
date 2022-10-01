import { hash } from '$lib/util.server';
import { PrismaClient, UserRole } from '@prisma/client';
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
					createdAppointments: { createMany: { data: [...config.appointments] } },
					createdGroups: {
						createMany: {
							data: Array.from({ length: config.appointments.length * config.groupCount }, (_, i) => i).map((x) => ({
								appointmentId: (x % config.appointments.length) + 1,
								maxMemberCount: config.groupMemberCount
							}))
						}
					}
				}
			})
			.catch((e) => import.meta.env.DEV && console.log(e));
});

export default prisma;
