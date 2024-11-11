import type { GuildMember, Role } from 'discord.js';
import log from './logger';
import { GAMES } from './constants';

async function addRole(member: GuildMember, role: Role) {
	log.info(`Adding role to ${member.user.username} in ${member.guild.name}`)
	await member.roles.add(role.id);
}

async function removeRole(member: GuildMember, role: Role) {
	log.info(`Removing role from ${member.user.username} in ${member.guild.name}`)
	await member.roles.remove(role.id);
}

export async function updateMember(member: GuildMember) {
	let role = member.guild.roles.cache.find(role => role.name === 'Playing Now');

	if (!role) {
		role = (await member.guild.roles.fetch()).find(role => role.name === 'Playing Now');

		if (!role) {
			log.warn(`Playing Now role does not exist in guild ${member.guild.name}`);
			return; // ! race condition - can create multiple roles
			// role = await member.guild.roles.create({
			// 	color: '#E67E22',
			// 	name: 'Playing Now',
			// });
			// log.success(`Created role in guild ${member.guild.name}`);
		}
		
	}
	
	if (member.presence === null) {
		if (member.roles.cache.has(role.id)) {
			await removeRole(member, role);
		} 
		return;
	}

	const isPlaying = member.presence.activities.some(activity => activity.type === 0 && GAMES.some(game => game === activity.name));

	if (isPlaying && !member.roles.cache.has(role.id)) {
		await addRole(member, role);
	} else if (!isPlaying && member.roles.cache.has(role.id)) {
		await removeRole(member, role);
	}
}