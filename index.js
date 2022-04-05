// The necessary classes from discord.js
const { Client, Intents, VoiceChannel, RichEmbed, MessageEmbed } = require('discord.js');
const { token, prefix } = require('./config.json');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

async function play(connection, song, channel)
{
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

const {
    AudioPlayerStatus,
    StreamType,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    getVoiceConnection,
} = require('@discordjs/voice');
const yts = require('yt-search');

// Instantiate a Client class, sets permissions the bot will follow
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

let queue = [];

// Runs on client ready
client.once('ready', () => {
    console.log(`logged in as ${client.user.tag}`);
    console.log('Ready to recieve all ' + prefix);
});

client.on('messageCreate', async msg => {
    if(msg.author.bot) return;  // No bots replying to eachother

    let guild = msg.guild;

    console.log('got message');
    console.log(`${msg.content}`);

    // Ignore messages without the prefix '>'
    if(msg.content.startsWith(prefix)) {

        // Removes the prefix and creates an array of arguments fromt the message
        const args = msg.content.slice(prefix.length).trim().split(/ +/g);

        // The first argument is the command to the bot
        const command = args[0];

        if(command === 'help') {
            msg.channel.send('No.');
        }

        else if(command === 'yt') {
            const ytLink = args[1];

            // Checking if user provided any arguments
            if(!ytLink) {
                msg.channel.send('Please provide a youtube link');
                return;
            }

            // Checking if user is in a voice channel
            if(!msg.member.voice.channel) {
                msg.channel.send('You must be in a voice channel to play music');
                return;
            }

            const search = msg.content.slice(args[0].length + prefix.length).trim();

            const searchResults = await ytSearch(search);

            if(!searchResults.videos[0]) {
                msg.channel.send('Couldn\'t find a matching video');
                //return;
            }
            const song = searchResults.videos[0];

            // Check if the queue is empty if yes then play immediately
            if(!queue.length) {
                queue.push(song);
                
                // Create a connection in line with the documentation
                const connection = joinVoiceChannel({
                    channelId: msg.member.voice.channel.id,
                    guildId: guild.id,
                    adapterCreator: guild.voiceAdapterCreator,
                });

                play(connection, queue[0], msg.channel);
            }
            // If no then just add to the queue
            else {
                queue.push(song);
                msg.channel.send(`Queued: ${song.title}`);
            }
        }

        else if(command === 'stop') {
            const connection = getVoiceConnection(msg.channel.guild.id);

            if(!connection) { 
                msg.channel.send('You\'re not in the same voice channel as the bot.');
            }
            else {
                connection.destroy();
                queue = [];
            }
        }

        else if(command === 'skip') {
            const connection = getVoiceConnection(msg.channel.guild.id);

            if(!connection) { 
                msg.channel.send('You\'re not in the same voice channel as the bot.');
            }
            else {
                queue.shift();
                if(!queue.length) connection.destroy();
                else play(connection, queue[0], msg.channel);
            }

        }
    }
});

// Logs into discord with token from config.json
client.login(token);