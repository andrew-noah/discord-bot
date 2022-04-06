// The necessary classes from discord.js
const { Client, Intents, VoiceChannel, RichEmbed, MessageEmbed, Collection } = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

// Instantiate a Client class, sets permissions the bot will follow
const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] 
});

client.config = config;
client.commands = new Collection();

const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for(const file of events) {
    // File off the .js extension
    const eventName = file.split('.')[0];
    // Require the file itself
    const event = require(`./events/${file}`);

    // It just works
    client.on(eventName, event.bind(null, client));
}

const commands = fs.readdirSync('./commands').filter(file  => file.endsWith('.js'));
for(const file of commands) {
    const commandName = file.split('.')[0];
    const command = require(`./commands/${file}`);

    client.commands.set(commandName, command);
}

// Logs into discord with token from config.json
client.login(config.token);