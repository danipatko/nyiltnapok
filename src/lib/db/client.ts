import { PrismaClient, UserRole } from '@prisma/client';
import config from '../../../config';

// TODO? not tested: may create way too many clients in dev mode

const prisma = new PrismaClient();
prisma.$connect().then(async () => {
	// create default user + appointments + groups defined in config | only runs one after db init/wipe
	import.meta.env.DEV && console.log('Creating default admin profile...');
	if (!(await prisma.user.count({ where: { id: 0 } })))
		await prisma.user
			.create({
				data: {
					id: 0, // autoincrement starts from 1
					email: '',
					fullname: 'admin',
					role: UserRole.admin,
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
