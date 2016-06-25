'use strict';

const URL = 'http://www.hltv.org/hltv.rss.php?pri=15';
const FeedParser = require('feedparser');
const moment = require('moment');
const request = require('request');
const EventEmitter = require('events').EventEmitter;

module.exports = class Matches extends EventEmitter {
    constructor() {
        super();
    }

    getMatches() {
        let p = new Promise(
            (resolve, reject) => {
                let parser = new FeedParser();
                let buffer = [];

                parser.on('error', (err) => {
                    console.log("err", err);
                    reject(err);
                });

                parser.on('end', () => {
                    resolve(buffer);
                });

                parser.on('readable', this.onReadable.bind(parser, buffer));

                request(URL)
                    .on('error', (err) => {
                        console.error(err);
                        reject(err);
                    })
                    .on('response', (res) => {
                        if (res.statusCode != 200) {
                            console.error("bad status code from HLTV");
                            reject(res.statusCode);
                        }
                        else {
                            res.pipe(parser);
                        }
                    });
            }
        );
        return p;
    }

    onReadable(buffer) {
        const meta = this.meta;
        let item;

        while (item = this.read()) {
            let title = item.title.replace(new RegExp("No team", 'g'), '--TBD-- ');
            let time = moment(item.date, 'ddd MMM DD YYYY HH:mm:ss');
            buffer.push({
                match : title,
                time : (time.unix() < moment().unix()) ? 'LIVE' : time.fromNow(),
                clock: time.format('HH:mm') + ' CET ',
                link : item.link,
                timestamp: time.unix(),
                desc: item.description
            });
        }
    }

    formatLine(item) {
        return item;
    }

}