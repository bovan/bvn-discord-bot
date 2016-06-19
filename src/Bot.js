'use strict';

const Discord = require('discord.js');
const config = require('../config/bot.js');
const Actions = require('./Actions.js');

module.exports = class Bot {
    constructor() {
        this.client = new Discord.Client({
            autoReconnect : true
        });
        this.loginTimer = null;
        this.actions = new Actions();
        this.setupEvents();
    }

    setupEvents() {
        this.client.on('message', (msg) => {
            let cmd = msg.content.trim().split(' ')[0];
            if (cmd.length > 0) {
                this.actions.handle(msg, cmd);
            }
        });
    }

    login() {
        this.client.loginWithToken(config.token);
    }
};