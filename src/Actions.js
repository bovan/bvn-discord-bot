'use strict';

const Hue = require('../lib/hue.js');
const users = require('../config/users.js');

module.exports = class Actions {
    constructor() {
        this.hue = new Hue();
        this.cmds = {
            '!hello': (msg) => {
                msg.reply('Hello there!');
            },
            '!lights': (msg) => {
                this.hue.getLights().then((lights) => {
                    msg.reply(this.hue.lightsToStrings(lights));
                });
            },
            '!admin': (msg) => {
                msg.reply((this.isAdmin(msg)) ? 'is admin' : 'is not admin');
            }
        };
    }

    handle(msg, cmd) {
        if (this.cmds[cmd])
            this.cmds[cmd](msg);
    }

    isAdmin(msg) {
        return users.admin.indexOf(msg.author.id) >= 0;
    }
}