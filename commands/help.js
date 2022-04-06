const { Client, Message } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} msg 
 * @param {String[]} args 
 */
exports.run = (client, msg, args) => {
    msg.channel.send('No, but modular and not cached suck it nerd.');
}

exports.name = 'help';
exports.description = 'Ask for help.';