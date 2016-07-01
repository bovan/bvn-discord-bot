import Discord = require('discord.js');
import { BotOptions } from '../config/bot';
import { Actions } from './Actions';

export class Bot {
    private client: Discord.Client;
    private loginTimer: number;
    private actions: Actions;

    constructor() {
        this.client = new Discord.Client({
            autoReconnect : true
        });
        this.loginTimer = null;
        this.actions = new Actions();
        this.setupEvents();
    }

    setupEvents() {
        this.client.on('message', (msg: Discord.Message) => {
            let cmd = msg.content.trim().split(' ')[0];
            if (cmd.length > 0) {
                this.actions.handle(msg, cmd);
            }
        });
    }

    login() {
        this.client.loginWithToken(BotOptions.token);
    }
};