const { Client, Intents, Collection } = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

// Instantiate a Client class, sets permissions the bot will follow
const client = new Cient({ 
    intents: [Intents.S.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] 
});

client.config = config;
client.commands = new Collection();

// Loop through the events directory to find all the definined events
const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for(const file of events) {
    // File off the .js extension
    const eventName = file.split('.')[0];
    // Require the file itself
    const event = require(`./events/${file}`);

    // Bind event names to the client
    client.on(eventName, event.bind(null, client));
}

// Same thing with the commands directory
const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commands) {
    const commandName = file.split('.')[0];
    const command = require(`./commands/${file}`);

    // Add the command name and function to the collection of commands
    client.commands.set(commandName, command);
}

// Logs into discord with token from config.json
client.login(config.token);
