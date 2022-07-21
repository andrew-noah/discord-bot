const { joinVoiceChannel } = require('@discordjs/voice');
const { Client, Message } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} msg 
 */
 exports.run = (client, msg) => {

    if(client.voiceConnection) {
        msg.channel.send('Voice connection already established.')
        return;
    }

    if(!msg.member.voice.channel) {
        msg.channel.send('You must be in a channel to order the bot to join.');
        return;
    }

    const connection = joinVoiceChannel({
        channelId: msg.member.voice.channel.id,
        guildId: msg.guild.id,
        adapterCreator: msg.guild.voiceAdapterCreator,
    });
            
    client.voiceConnection = connection;
}

exports.name = 'join';
exports.description = 'join.';