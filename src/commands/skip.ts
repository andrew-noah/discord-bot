import { CustomClient } from '../types'
import { Message, TextChannel } from 'discord.js'
import { getVoiceConnection, VoiceConnectionReadyState } from '@discordjs/voice'

module.exports = {
    name: 'skip',
    execute(client: CustomClient, message: Message, args: string[]) {
        if(!message.guildId) return;
        const connection = getVoiceConnection(message.guildId);

        if(!connection) {
            (message.channel as TextChannel).send("You're not in the same voice channel as the bot.");
            return;
        }

        (connection.state as VoiceConnectionReadyState).subscription?.player.stop();
    }
};
