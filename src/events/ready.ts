import { Events } from "discord.js"
import { CustomClient } from "../types";

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client: CustomClient) {
        if(client.user) {
            console.log(`Ready! Logged in as ${client.user.tag}, and accepting all ${client.config.prefix}`);
        } else {
            console.log(`Could not load client!`);
        }
    }
};
