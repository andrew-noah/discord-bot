const { Client, Message } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');


/**
 * 
 * @param {Client} client 
 * @param {Message} msg 
 */
 exports.run = (client, msg) => {
    const connection = getVoiceConnection(msg.guild.id);

    if(connection === undefined) {
        msg.channel.send('No voice connection established.');
        return;
    }

    const isSameChannel = msg.member.voice.channelId === msg.guild.members.me.voice.channelId;

    if(isSameChannel) {    
        connection.destroy();
        console.log('Destroyed voice connection');
    } else {
        msg.channel.send('Join the bot\'s channel to tell it to leave.');
    }
}

exports.name = 'leave';
exports.description = 'leave.';
