const { Client, Message } = require('discord.js');
const { play } = require('../music/play.js');

const { createReadStream } = require('fs')
const { join } = require('path');
const join_dis = require('./join.js');

const {
    AudioPlayerStatus,
    StreamType,
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
} = require('@discordjs/voice');

/**
 * 
 * @param {Client} client 
 * @param {Message} msg 
 * @param {String[]} args 
 */
 exports.run = (client, msg, args) => {
    if(getVoiceConnection(msg.guild.id) === undefined) {
        join_dis.run(client, msg);
    }
    const connection = getVoiceConnection(msg.guild.id);

    let boom_sfx = createAudioResource(createReadStream(join(__dirname, '../resources/vine_boom.mp3')), {
        inlineVolume : false
     });
    
    const player = createAudioPlayer();
    
    player.play(boom_sfx);
    connection.subscribe(player);
}

exports.name = 'boom';
exports.description = 'boom.';