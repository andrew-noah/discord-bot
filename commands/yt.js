const {Client, Message} = require('discord.js');
let music = require('../music/play.js');

const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const join = require('./join.js');

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
    const connection = getVoiceConnection(msg.guild.id);

    // Check if the queue is empty, if yes then play immediately
    if(!music.queue.length) {
        music.queue.push(search);
        
        if(!connection) {
            join.run(client, msg);
        }

        // Call the music player
        music.play(msg, music.queue[0], msg.channel);
    }
    // If no then just add to the queue
    else {
        music.queue.push(search);
        msg.channel.send("Song queued!");
    }
}

exports.run = run;