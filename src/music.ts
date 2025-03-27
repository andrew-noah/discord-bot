import YTDlpWrap, { YTDlpReadable } from "yt-dlp-wrap";
import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel, NoSubscriberBehavior, VoiceConnection } from "@discordjs/voice";
import { EmbedBuilder, TextChannel, Message } from "discord.js";

const ytDl = new YTDlpWrap(`${process.cwd()}/yt-dlp`); 

type MusicQueueItem = [string, TextChannel];
type MusicQueue = MusicQueueItem[];
export let queue: MusicQueue = []; 

let getSongName = (queue: MusicQueueItem): string => {
    return queue[0];
};

let getChannel = (queue: MusicQueueItem): TextChannel => {
    return queue[1];
};

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

    connection.on('stateChange', (oldState, newState) => {
        console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
    });

    return connection;
};

let initAudioPlayer = (connection: VoiceConnection): AudioPlayer | undefined => {
    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Stop
        }
    });

    if(!player) {
        console.error('Could not init AudioPlayer!');
        return undefined;
    }

    player.on('error', error => {
        console.error(`Error: ${error.message} from ${error.name}`);
        getNextSong(player, connection); 
    });

    player.on('stateChange', (oldState, newState) => {
        console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
    });

    player.on(AudioPlayerStatus.Idle, () => {
        getNextSong(player, connection); 
    });

    return player;
}

let findVideoInfo = async (search: string): Promise<any> => {
    return ytDl.getVideoInfo(['--default-search', 'ytsearch', search]);
};

let searchYoutube = async (search: string): Promise<YTDlpReadable> => {
    return ytDl.execStream(['--default-search', 'ytsearch', '-x', '--audio-format', 'mp3', search]); 
};

export let getNextSong = async(player: AudioPlayer, connection: VoiceConnection) => {
    queue.shift();
    if(queue.length === 0) {
        // I don't like this and I want it gone, but for now I need it to prevent crashes
        try {
            connection.destroy();
        } catch {
            console.log('caught duplicate connection destruction'); 
        }
    } else {
        loadSong(queue[0], player, connection);
    }   
};

export let loadSong = async (song: MusicQueueItem, player: AudioPlayer, connection: VoiceConnection) => {
    let stream = searchYoutube(getSongName(song));
    let songInfo = await findVideoInfo(getSongName(song));

    const embed = new EmbedBuilder()
        .setTitle(`Now Playing: ${songInfo.title}`)
        .setDescription(`${songInfo.channel} - ${songInfo.duration_string}`)
        .setURL(`${songInfo.original_url}`)
        .setThumbnail(`${songInfo.thumbnail}`);

    getChannel(song).send({ embeds: [embed] });

    player.play(createAudioResource(await stream));
}

export let startPlayer = async (message: Message) => {
    const connection = initVoiceConnection(message); 

    if(!connection) {
        const channel = message.channel as TextChannel;
        channel.send(`Failed to connect!`);
        return;
    }

    let player = initAudioPlayer(connection);

    if(!player) {
        const channel = message.channel as TextChannel;
        channel.send(`Failed to init Audio Player!`);
        return;
    }
    connection.subscribe(player);

    loadSong(queue[0], player, connection);
};
