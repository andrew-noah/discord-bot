// Runs on client ready
const { Client } = require('discord.js');

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
    console.log(`logged in as ${client.user.tag}`);
    console.log('Ready to recieve all ' + client.config.prefix);
};