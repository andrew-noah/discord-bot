const { createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const { Client, Message } = require('discord.js');

const join = require('./join.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} msg 
 * @param {String[]} args 
 */
 exports.run = (client, msg, args) => {

    if(client.voiceConnection === undefined) {
        join.run(client, msg);
    } 
    
    const player = createAudioPlayer();

    const boom_sfx = createAudioResource('/home/bot/discord-bot/resources/vine_boom.mp3');
    
    player.play(boom_sfx);
    client.voiceConnection.subscribe(player);
}

exports.name = 'boom';
exports.description = 'boom.';