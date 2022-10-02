import { checkNull } from '$lib/auth/jwt';
import { redirect } from '@sveltejs/kit';
import prisma from '$lib/db/client';

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

	const id = url.searchParams.has('id') ? Number(url.searchParams.get('id')?.toString()) : NaN;
	const separator = url.searchParams.get('format') === 'tsv' ? '\t' : ',';
	if (isNaN(id)) {
		return new Response('Rossz ID!', { status: 400, statusText: 'Bad request' });
	}

	const group = await prisma.group.findFirst({
		select: {
			id: true,
			maxMemberCount: true,
			appointment: { select: { label: true } },
			members: { select: { fullname: true, email: true, groupId: true, createdAt: true } }
		},
		where: { id }
	});
	if (!group) {
		return new Response('Nincs ilyen csoport!', { status: 404, statusText: 'Not found' });
	}

	// generate csv
	const result: string[] = [
		`${group.appointment.label} - Csoport #${group.id} névsora (${group.members.length}/${group.maxMemberCount} fő)`,
		'',
		join(['név', 'e-mail', 'csoport szám', 'regisztráció ideje'], separator)
	];
	for (const member of group.members) {
		result.push(join([member.fullname, member.email, member.groupId?.toString() ?? '-', member.createdAt.toLocaleDateString()], separator));
	}

	return new Response('\uFEFF' + result.join(ln), {
		status: 200,
		headers: {
			'Content-Type': 'text/csv; charset=utf-16le',
			'Content-Disposition': `attachment; filename="${group.appointment.label} csoport #${group.id}.${separator == ',' ? 'csv' : 'tsv'}"`
		}
	});
};
