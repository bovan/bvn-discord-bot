import FeedParser = require('feedparser');
import moment = require('moment');
import request = require('request');
import { RssReader, RssList } from './rssreader';

export class Matches extends RssReader {
    private rssReader: RssReader;

    constructor() {
        super();
        this.url = 'http://www.hltv.org/hltv.rss.php?pri=15';
    }

    parse(item: any) {
        let title = item.title.replace(new RegExp("No team", 'g'), '--TBD-- ');
        let time = moment(item.date, 'ddd MMM DD YYYY HH:mm:ss');
        return {
            match : title,
            time : (time.unix() < moment().unix()) ? 'LIVE' : time.fromNow(),
            clock: time.format('HH:mm') + ' CET ',
            link : item.link,
            timestamp: time.unix(),
            desc: item.description
        };
    }
}