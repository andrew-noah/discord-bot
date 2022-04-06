const { MessageEmbed } = require('discord.js');

const {
    AudioPlayerStatus,
    StreamType,
    createAudioPlayer,
    createAudioResource,
} = require('@discordjs/voice');

var queue = [];

exports.queue = queue;

const ytdl = require('ytdl-core');

play = (connection, song, channel) => {
    // The audio stream is the 'object' that we'll be playing    
    const stream = ytdl(song.url, {filter: 'audioonly' });

    // This only works for streaming for some reason
    //const stream = ytdl(song.url, {highWaterMark: 1<<25, quality: [91,92,93,94,95], liveBuffer: 4900});

    // The actual entity that gets played through the discord bot (a physical file or a stream)
    const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
    const player = createAudioPlayer();

    player.play(resource)
    connection.subscribe(player);
    
    // With a full youtube URL we can extract the code at the end
    // and grab a thumbnail for the embeded portion
    let ytCode = song.url.split('v=').pop();

    const embed = new MessageEmbed()
        .setTitle(`Now Playing: ${song.title}`)
        .setDescription(`${song.author.name} - ${song.timestamp}`)
        .setURL(`${song.url}`)
        .setThumbnail(`https://img.youtube.com/vi/${ytCode}/0.jpg`);

    channel.send({ embeds: [embed] });

    player.on(AudioPlayerStatus.Idle, () => {
        console.log('detect idle');
        queue.shift();
        if(!queue.length) connection.destroy();
        else play(connection, queue[0], channel);
    });
}

exports.play = play;