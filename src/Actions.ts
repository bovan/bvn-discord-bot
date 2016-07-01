import Discord = require('discord.js');
import { HueManager } from '../lib/HueManager';
import { Matches } from '../lib/Matches';
import { News } from '../lib/HltvNews';
import { Users } from '../config/users';

interface ActionsCommands {
    [cmd: string]: Function;
}

export class Actions {
    private hue: HueManager;
    private matches: Matches;
    private news: News;
    private cmds: ActionsCommands;

    constructor() {
        this.hue = new HueManager();
        this.matches = new Matches();
        this.news = new News();
        this.cmds = {
            '!hello': this.sayHello,
            '!lights': this.getLights,
            '!admin': this.isAdmin,
            '!matches': this.getMatches,
            '!news' : this.getNews
        };
    }

    handle(msg: Discord.Message, cmd: string) {
        if (this.cmds[cmd]) {
            console.log("got cmd " + cmd + " from " + msg.author.username);
            this.cmds[cmd].call(this, msg);
        }
    }

    sayHello(msg: Discord.Message) {
        msg.reply('Hello there!');
    }

    isAdmin(msg: Discord.Message) {
        let admin = (Users.admin.indexOf(msg.author.id) >= 0);
        msg.reply(admin ? 'is admin' : 'is not admin');
    }

    getLights(msg: Discord.Message) {
        let hue = this.hue;
        hue.getLights().then((lights) => {
            msg.reply(hue.lightsToStrings(lights));
        });
    }

    getNews(msg: Discord.Message) {
        this.news.getRss().then((data: any) => {
            if (data.length > 0) {
                let str: string = '';
                str += "HLTV News \n";
                for (let i = 0; i < data.length; i++) {
                    str += data[i].title
                    str += ' ';
                    str += data[i].time;
                    str += ' ';
                    str += data[i].link;
                    str += "\n";
                    }
                msg.reply(str);
            }
        });
    }

    getMatches(msg: Discord.Message) {
        this.matches.getRss().then((data: any) => {
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
        .catch((err: Error) => {
            console.log(err);
            msg.reply("No matches found, check www.hltv.org");
        })
    }
}