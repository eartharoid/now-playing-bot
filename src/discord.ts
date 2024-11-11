import {
	Client,
	Events,
	GatewayIntentBits
} from 'discord.js';
import log from './logger';
import { updateMember } from './tracking';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
	],
});

client.once(Events.ClientReady, async (client) => {
	log.success(`Connected to Discord as ${client.user.tag}`);
	for (const guild of client.guilds.cache.values()) {
		for (const member of guild.members.cache.values()) {
			if (member.presence && member.presence.activities) await updateMember(member);
		}
	}
});

client.on(Events.GuildCreate, async (guild) => {
	for (const member of guild.members.cache.values()) {
		if (member.presence && member.presence.activities) await updateMember(member);
	}
});

client.on(Events.PresenceUpdate, async (oldPresence, newPresence) => {
	if (newPresence.member) await updateMember(newPresence.member);
});


export default client;