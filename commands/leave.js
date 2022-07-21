const { Client, Message } = require('discord.js');



/**
 * 
 * @param {Client} client 
 * @param {Message} msg 
 * @param {String[]} args 
 */
 exports.run = (client, msg, args) => {

    if(client.voiceConnection === undefined) {
        msg.channel.send('No voice connection established.');
        return;
    }

    const isSameChannel = msg.member.voice.channelId === msg.guild.me.voice.channelId;

    if(isSameChannel) {    
        client.voiceConnection.destroy();
        client.voiceConnection = undefined;
    } else {
        msg.channel.send('Join the bot\'s channel to tell it to leave.');
    }
}

exports.name = 'leave';
exports.description = 'leave.';