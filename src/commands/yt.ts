import { CustomClient } from '../types'
import { Message, TextChannel, VoiceState }  from 'discord.js'

import { getNextSong, loadSong, queue, startPlayer } from '../music'
import { AudioPlayerStatus, getVoiceConnection, VoiceConnectionReadyState } from '@discordjs/voice';


module.exports = {
    name: 'yt',
    async execute(client: CustomClient, message: Message, args: string[]) {
        if(!message.guildId) return;

        const search: string = args.slice(1, args.length).join(' ');
        queue.push([search, message.channel as TextChannel]);

        (message.channel as TextChannel).send("Song queued!");

        let connection = getVoiceConnection(message.guildId);

        if(!connection) {
            startPlayer(message);
        } else {
            let player = (connection.state as VoiceConnectionReadyState).subscription!.player;
            if(player.state.status === AudioPlayerStatus.Idle) {
                console.log(`Song recieved during timeout period`)
                    getNextSong(player, connection); 
            }
        }
    }
};
