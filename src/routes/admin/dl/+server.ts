import { checkNull } from '$lib/auth/jwt';
import { redirect } from '@sveltejs/kit';
import config from '../../../../config';
import prisma, { getGroups } from '$lib/db/client';

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

	// (group id)
	const index = url.searchParams.has('id') ? Number(url.searchParams.get('id')?.toString()) : NaN;
	// id of appointment
	const id = url.searchParams.has('aid') ? Number(url.searchParams.get('aid')?.toString()) : NaN;
	const separator = url.searchParams.get('format') === 'tsv' ? '\t' : ',';
	if (isNaN(id) || isNaN(index) || index < 0 || index > config.groupCount) {
		return new Response('Rossz ID!', { status: 400, statusText: 'Bad request' });
	}

	// selects appointment data and an index'th section of members
	const group = await prisma.appointment.findFirst({
		select: {
			id: true,
			totalMembers: true,
			totalGroups: true,
			label: true,
			members: {
				select: { fullname: true, email: true, createdAt: true },
				orderBy: { fullname: 'asc' },
				skip: index * config.groupMemberCount,
				take: config.groupMemberCount
			}
		},
		where: { id: id }
	});

	if (!group) {
		return new Response('Nincs ilyen csoport!', { status: 404, statusText: 'Not found' });
	}

	// generate csv
	const result: string[] = [
		`${group.label} - Csoport #${group.id} névsora (${group.members.length}/${group.totalMembers} fő)`,
		'',
		join(['név', 'e-mail', 'csoport szám', 'regisztráció ideje'], separator)
	];
	for (const member of group.members) {
		result.push(join([member.fullname, member.email, group.id.toString(), member.createdAt.toLocaleString()], separator));
	}

	return new Response('\uFEFF' + result.join(ln), {
		status: 200,
		headers: {
			'Content-Type': 'text/csv; charset=utf-16le',
			'Content-Disposition': `attachment; filename="${group.label} csoport #${group.id}.${separator == ',' ? 'csv' : 'tsv'}"`
		}
	});
};
