'use strict';

const Hue = require('../lib/hue.js');
const Matches = require('../lib/Matches.js');
const users = require('../config/users.js');

module.exports = class Actions {
    constructor() {
        this.hue = new Hue();
        this.matches = new Matches();
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
            },
            '!matches': this.getMatches.bind(this)
            };
    }

    handle(msg, cmd) {
        if (this.cmds[cmd]) {
            console.log("got cmd " + cmd + " from " + msg.author.username);
            this.cmds[cmd](msg);
        }
    }

    isAdmin(msg) {
        return users.admin.indexOf(msg.author.id) >= 0;
    }

    getMatches(msg) {
        this.matches.getMatches().then((data) => {
            if (data.length > 0) {
                let str = " - **MATCHES ON HLTV** - \n`";
                // get max length of line
                let maxLength = 0;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].match.length > maxLength)
                        maxLength = data[i].match.length;
                }
                // add 3 to because space is <3
                maxLength = maxLength + 3;
                for (let i = 0; i < data.length; i++) {
                    str += data[i].match
                    let k = maxLength - data[i].match.length;
                    for (let j = 0; j < k; j++)
                        str += ' ';
                        str += data[i].clock + '(';
                        str += data[i].time + ')';
                        str += ((i + 1) < data.length) ? "\n" : '`';
                    }

                msg.reply(str);
            }
        })
        .catch((err) => {
            console.log(err);
            msg.reply("No matches found, check www.hltv.org");
        })
    }
}