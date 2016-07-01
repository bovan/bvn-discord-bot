import FeedParser = require('feedparser');
import moment = require('moment');
import request = require('request');
import { EventEmitter } from 'events';

export interface MatchList {
    [match: number]: {
        match : string,
        time : string,
        clock: string,
        link : string,
        timestamp: number,
        desc: string
    }
    push: Function;
}

export class Matches extends EventEmitter {
    private URL = 'http://www.hltv.org/hltv.rss.php?pri=15';

    constructor() {
        super();
    }

    getMatches() {
        let p = new Promise(
            (resolve, reject) => {
                let parser = new FeedParser();
                let buffer:MatchList = [];

                parser.on('error', (err: Error) => {
                    console.log("err", err);
                    reject(err);
                });

                parser.on('end', () => {
                    resolve(buffer);
                });

                parser.on('readable', () => this.onReadable(parser, buffer));

                request(this.URL)
                    .on('error', (err: Error) => {
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

    onReadable(parser: any, buffer: MatchList) {
        let item: any;
        while (item = parser.read()) {
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
}