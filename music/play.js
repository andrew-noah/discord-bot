const { MessageEmbed } = require('discord.js');

const {
    AudioPlayerStatus,
    StreamType,
    createAudioPlayer,
    createAudioResource,
} = require('@discordjs/voice');

// Initialize the music queue. 
// Yes, globals bad blah blah blah
var queue = [];
exports.queue = queue;

const ytPlay = require('play-dl');

play = async (connection, song, channel) => {
    const { stream } = await ytPlay.stream(song.url, { discordPlayerCompatibility: true });

    //TODO: Figure out how to make streaming work side by side
    //const stream = ytdl(song.url, {highWaterMark: 1<<25, quality: [91,92,93,94,95], liveBuffer: 4900});

    const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
    const player = createAudioPlayer();

    player.play(resource)
    connection.subscribe(player);
    
    // With a full youtube URL we can extract the code at the end
    // and grab a thumbnail for the embeded portion
    let ytCode = song.url.split('v=').pop();

    // Create an embedded message showing information about the video
    const embed = new MessageEmbed()
        .setTitle(`Now Playing: ${song.title}`)
        .setDescription(`${song.author.name} - ${song.timestamp}`)
        .setURL(`${song.url}`)
        .setThumbnail(`https://img.youtube.com/vi/${ytCode}/0.jpg`);

    channel.send({ embeds: [embed] });

    // Figure out what to do next when the current video ends
    player.on(AudioPlayerStatus.Idle, () => {
        queue.shift();
        if(!queue.length) connection.destroy();
        else play(connection, queue[0], channel);
    });
}

exports.play = play;