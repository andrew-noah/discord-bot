//import { Client, Message } from 'discord.js';
const { Client, Message } = require('discord.js');

// Handles commands coming at the bot
/**
 * 
 * @param {Client} client 
 * @param {Message} msg 
 * @returns 
 */
module.exports = (client, msg) => {
    // Ignore bots
    if(msg.author.bot) return;

    // Ignore messages without '>' prefix
    if(!msg.content.startsWith(client.config.prefix)) return;

    // Slice provided args up into an array
    const args = msg.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args[0].toLowerCase();

    const cmd = client.commands.get(command);

    if(!cmd) return;

    cmd.run(client, msg, args);
};