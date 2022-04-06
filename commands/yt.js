const {Client, Message} = require('discord.js');
const ytSearch = require('yt-search');
let music = require('../music/play.js');

const { joinVoiceChannel } = require('@discordjs/voice');

/**
 * 
 * @param {Client} client 
 * @param {Message} msg 
 * @param {String[]} args 
 * @returns 
 */
async function run(client, msg, args) {
    const ytLink = args[1];
    const guild = msg.guild;

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

    const search = msg.content.slice(args[0].length + client.config.prefix.length).trim();

    const searchResults = await ytSearch(search);

    if(!searchResults.videos[0]) {
        msg.channel.send('Couldn\'t find a matching video');
        return;
    }
    const song = searchResults.videos[0];

    // Check if the queue is empty if yes then play immediately
    if(!music.queue.length) {
        music.queue.push(song);
        
        // Create a connection in line with the documentation
        const connection = joinVoiceChannel({
            channelId: msg.member.voice.channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });

        music.play(connection, music.queue[0], msg.channel);
    }
    // If no then just add to the queue
    else {
        music.queue.push(song);
        msg.channel.send(`Queued: ${song.title}`);
    }
}

exports.run = run;