import { CustomCommand, CustomClient } from '../types'
import { Message, TextChannel, VoiceChannel} from 'discord.js'
import { createAudioResource, joinVoiceChannel, createAudioPlayer, AudioPlayerStatus, AudioResource, getVoiceConnection, VoiceConnection, NoSubscriberBehavior, StreamType, PlayerSubscription } from '@discordjs/voice'
import YTDlWrap, { YTDlpReadable } from 'yt-dlp-wrap'

const ytDl = new YTDlWrap('/sbin/yt-dlp'); 

let initVoiceConnection = (message: Message): VoiceConnection | undefined => {
    const channel = message.member?.voice.channel; 

    if(!channel) { 
        console.error(`User voice channel invalid!`);
        return undefined;
    } else if(!message.guildId) {
        console.error(`guildId is invalid!`);
        return undefined;
    }

    // Check for existing voice connection
    let connection = getVoiceConnection(message.guildId);

    // If that doesn't exist make one
    if(!connection) {
        connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: message.guildId,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        if(!connection) {
            console.error(`Failed to create voice connection!`);
            return undefined;
        }
    }

    return connection;
};

let searchYoutube = (args: string[]) => {
    const search: string = args.slice(1, args.length).join(' ');

    let stream = ytDl.execStream([args[1], '-f', 'best[ext=mp4]']); 

    return stream;
};

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
        }

        connection.destroy();
    }
}
