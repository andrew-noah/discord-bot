const { Client, Message } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

var music = require('../music/play.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} msg 
 */
exports.run = (client, msg) => {
    const connection = getVoiceConnection(msg.channel.guild.id);

    if(!connection) { 
        msg.channel.send('You\'re not in the same voice channel as the bot.');
    }
    else {
        music.queue.shift();
        if(!music.queue.length) connection.destroy();
        else music.play(connection, music.queue[0], msg.channel);
    }
};