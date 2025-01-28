import { CustomCommand, CustomClient } from '../types'
import { Message, TextChannel, VoiceChannel} from 'discord.js'
import { createAudioResource, joinVoiceChannel, createAudioPlayer, AudioPlayerStatus, AudioResource, getVoiceConnection, VoiceConnection, NoSubscriberBehavior, StreamType } from '@discordjs/voice'
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
    name: 'yt',
    execute(client: CustomClient, message: Message, args: string[]) {
        const connection = initVoiceConnection(message); 

        if(!connection) {
            const channel = message.channel as TextChannel;
            channel.send(`Failed to connect!`);
            return;
        }

        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Stop
            }
        });
        
        let stream = ytDl.execStream([args[1], '-x', '--audio-format', 'mp3']); 
        let resource = createAudioResource(stream);

        player.play(resource);
        connection.subscribe(player);

        player.on('error', error => {
            console.error(`Error: ${error.message} from ${error.name}`);
            player.stop();
            connection.destroy();
        });

        connection.on('stateChange', (oldState, newState) => {
            console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
        });

        player.on('stateChange', (oldState, newState) => {
            console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
        });
    }
};
