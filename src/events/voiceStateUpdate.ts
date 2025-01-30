import { Events, VoiceState } from "discord.js"
import { CustomClient } from "../types";
import { getVoiceConnection, VoiceConnectionReadyState }  from "@discordjs/voice";
import { queue } from "../music";

module.exports = {
    name: Events.VoiceStateUpdate, 
    once: false,
    execute(client: CustomClient, oldState: VoiceState, newState: VoiceState) {
        const botID: string = client.user?.id ?? 'invalid'; 

        if(newState.id === botID) {
            if(oldState.channel && !newState.channel) {
                const connection = getVoiceConnection(oldState.guild.id);

                if(connection) {
                    (connection.state as VoiceConnectionReadyState).subscription?.player.stop();
                    queue.length = 0;
                    console.log('Correcting force disconnect');
                }
            }
        }
    }
}
