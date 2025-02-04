import { CustomClient } from '../types'
import { Message, TextChannel }  from 'discord.js'

import { queue, startPlayer } from '../music'
import { getVoiceConnection } from '@discordjs/voice';


module.exports = {
    name: 'yt',
    async execute(client: CustomClient, message: Message, args: string[]) {
        if(!message.guildId) return;

        const search: string = args.slice(1, args.length).join(' ');
        queue.push([search, message.channel as TextChannel]);

        (message.channel as TextChannel).send("Song queued!");

        if(!getVoiceConnection(message.guildId)) {
            startPlayer(message);
        }
    }
};
