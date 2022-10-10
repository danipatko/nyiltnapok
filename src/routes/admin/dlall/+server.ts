import prisma, { addGroupToMembers } from '$lib/db/client';
import { checkNull } from '$lib/auth/jwt';
import { redirect } from '@sveltejs/kit';

const ln = '\r\n';

const join = (s: string[], separator: string): string => {
	return s
		.map((x) => {
			x = x.replaceAll(/(\r|\n)/gm, '');
			return x.includes(separator) ? `"${x}"` : x;
		})
		.join(separator);
};

export const GET: import('./$types').RequestHandler = async ({ cookies, url }) => {
	const user = await checkNull(cookies.get('token'), true);
	if (!user) {
		throw redirect(302, '/login');
	}

	const appointments = (
		await prisma.appointment.findMany({
			select: {
				id: true,
				label: true,
				totalGroups: true,
				members: { select: { email: true, fullname: true, id: true }, orderBy: { fullname: 'asc' } }
			}
		})
	).map((x) => {
		return { ...x, members: addGroupToMembers(x.totalGroups, x.members) };
	});

	// generate csv
	const result: string[] = [join(['name', 'email', 'appointment', 'group'], ',')];
	for (const app of appointments) {
		for (const member of app.members) {
			result.push(join([member.fullname, member.email, app.label, (member.group + 1).toString()], ','));
		}
	}

	return new Response('\uFEFF' + result.join(ln), {
		status: 200,
		headers: {
			'Content-Type': 'text/csv; charset=utf-16le',
			'Content-Disposition': `attachment; filename="__singleSendDump.csv"`
		}
	});
};
