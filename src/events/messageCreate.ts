import { Message, Events } from "discord.js"
import { CustomEvent, CustomClient } from "../types";

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute(client: CustomClient, message: Message) {
        if(message.author.id === client.user?.id) return;

        if(message.content[0] !== client.config.prefix) return;

        console.log(`Message recieved: ${message.content}`);
        const args: string[] = message.content.replace('>', '').split(' ');

        console.log(args);
        let func = client.commands.get(args[0]);

        if(func) {
            func(client, message, args);
        } else {
            console.log(`${args[0]} is not a valid command`);
        }
    }
}
