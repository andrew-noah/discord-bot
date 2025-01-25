import { Client, Collection, GatewayIntentBits, Message } from 'discord.js'
import configFile from "../config.json"

type CommandFunc = (client: CustomClient, message: Message, args: string[]) => void;

export interface CustomEvent
{
    name: string;
    once: boolean;
    execute: Function;
}
export interface CustomCommand
{
    name: string;
    execute: CommandFunc;
}

export interface Config
{
    token: string
    prefix: string
}

export class CustomClient extends Client
{
    config: Config;
    commands: Collection<string, CommandFunc>;

    constructor(intents: GatewayIntentBits[]) 
    {
        super({intents: intents});

        this.config = {
            token: configFile.test,
            prefix: configFile.prefix
        };

        this.commands = new Collection<string, CommandFunc>;
    }
}
