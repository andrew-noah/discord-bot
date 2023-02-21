// Runs on client ready
const { Client } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice')

const isWeekday = (date) => {
    return date.getDay() % 6 != 0;
}

const isSchoolHours = (date) => {
    const hour = date.getHours();
    return (hour >= 8 && hour < 15);
}

var music = require('../music/play.js');

/**
 * 
 * @param {Client} client 
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 */
module.exports = (client, oldState, newState) => {
    const botID = client.user.id;

    // This fixes the case of the bot being disconnected by an admin.
    // It properly destroys the voice connection and clears the music queue
    if(newState.id == botID) {
        if(oldState.channel && !newState.channel) {
            const connection = getVoiceConnection(oldState.guild.id);

            if(connection !== undefined) {
                connection.destroy();
                music.queue = [];
                console.log('Correcting force disconnect');
            }
        }
    }

    if(newState.id == client.config.mallardID) {
        let date = new Date();

        if(isWeekday(date) && isSchoolHours(date)) {
            newState.member.timeout(10 * 60 * 1000);
            console.log(`Mallard kicked at ${date}`);
        }
    }
};
