import { CustomClient } from '../types'
import { ConnectionService, Message, TextChannel } from 'discord.js'
import { getVoiceConnection, VoiceConnectionReadyState } from '@discordjs/voice'

import { queue } from '../music'

module.exports = {
    name: 'stop',
    execute(client: CustomClient, message: Message, args: string[]) {
        if(!message.guildId) {
            console.error(`guildid is invalid!`);
            return;
        }

        let connection = getVoiceConnection(message.guildId); 
        if(!connection) {
            const channel = message.channel as TextChannel;
            channel.send(`Not connected to voice!`);
            return;
        } else {
            (connection.state as VoiceConnectionReadyState).subscription?.player.stop();
        }

        console.log('Music queue cleared!');
        queue.length = 0;
    }
}
