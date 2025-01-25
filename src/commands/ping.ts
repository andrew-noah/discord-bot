import { CustomCommand, CustomClient } from '../types'
import { Message, TextChannel} from 'discord.js'

const ping: CustomCommand = {
    name: 'ping',
    execute(client: CustomClient, message: Message, args: string[]) {
        const msgChannel = client.channels.cache.get(message.channelId) as TextChannel;

        msgChannel.send('pong!');
    }
}

module.exports = ping;
