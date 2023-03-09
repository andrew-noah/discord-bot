const { Client, Message, ClientApplication } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

var music = require('../music/play.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} msg 
 */
exports.run = (client, msg) => {
    const connection = getVoiceConnection(msg.guild.id);

    if(!connection) { 
        msg.channel.send('You\'re not in the same voice channel as the bot.');
        return;
    }

    const player = connection.state.subscription.player;

    player.pause();
    music.queue.shift();

    if(!music.queue.length) {
        connection.destroy();
    } else {
        music.play(msg, music.queue[0], msg.channel);
    }
};
