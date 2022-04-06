const { Client, Message } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} msg 
 * @param {String[]} args
 */
exports.run = (client, msg, args) => {
    if(msg.member.permissions.has('ADMINISTRATOR')) {

        let cmdList = [];
        for(const cmd of client.commands.keys()) {
            cmdList.push(cmd);
        }

        for(const cmdName of cmdList) {
            console.log(`${cmdName}`);

            delete require.cache[require.resolve(`./${cmdName}.js`)];

            client.commands.delete(cmdName);
            const cmd = require(`./${cmdName}.js`);
            client.commands.set(cmdName, cmd);
        }

        msg.channel.send('Commands reloaded.');
    }
    else {
        msg.channel.send('You are not admin, fuck off.');
    }
};

exports.name = 'reload'