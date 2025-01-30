import { GatewayIntentBits } from "discord.js";
import { CustomEvent, CustomClient, CustomCommand } from "./types";
import fs from "fs"

// Instantiate a Client class, sets permissions the bot will follow
const client: CustomClient = new CustomClient(
    [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
);

const indexDir: string = './' + __dirname.split('/').pop();

// Loop through the events directory to find all the definined events
const eventFiles = fs.readdirSync(`./${indexDir}/events/`);
for (const file of eventFiles) {
	const filePath: string = `./events/${file}`;
	const event: CustomEvent = require(filePath);
   
    console.log(`Found event ${event.name}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
	} else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}

// Same thing with the commands directory
const commandFiles = fs.readdirSync(`./${indexDir}/commands/`);
for(const file of commandFiles) {
    const filePath: string = `./commands/${file}`; 
    const command: CustomCommand = require(filePath);

    console.log(`Found command ${command.name}`);
    client.commands.set(command.name, command.execute);
}

// Logs into discord with token from config.json
client.login(client.config.token);
