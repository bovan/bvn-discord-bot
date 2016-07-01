import FeedParser = require('feedparser');
import moment = require('moment');
import request = require('request');

export interface RssList {
    [index: number]: {
        title : string,
        time : string,
        clock: string,
        link : string,
        timestamp: number,
        desc?: string
    }
    push: Function;
}


export class RssReader  {
    public url: string = '';

    constructor() {

    }

    getRss(): Promise<RssList> {
        if (this.url.length === 0) {
            throw "No url defined for RssReader";
        }
        let p = new Promise(
            (resolve, reject) => {
                let parser = new FeedParser();
                let buffer:RssList = [];

                parser.on('error', (err: Error) => {
                    console.log("err", err);
                    reject(err);
                });

                parser.on('end', () => {
                    resolve(buffer);
                });

                parser.on('readable', () => this.onReadable(parser, buffer));

                request(this.url)
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

    onReadable(parser: any, buffer: RssList) {
        let item: any;
        while (item = parser.read()) {
            buffer.push(this.parse(item));
        }
    }

    parse(item: any): Object {
        return item;
    }
}