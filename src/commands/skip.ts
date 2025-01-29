import { CustomClient } from '../types'
import { ConnectionService, Message, TextChannel } from 'discord.js'
import { AudioPlayer, getVoiceConnection, VoiceConnectionReadyState, VoiceConnectionStatus } from '@discordjs/voice'
import { getNextSong, loadSong , queue } from '../music'

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
