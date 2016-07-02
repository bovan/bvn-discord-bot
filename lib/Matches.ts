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

    parse(item: any): Map<string, string> {
        let title = item.title.replace(new RegExp("No team", 'g'), '--TBD-- ');
        let time = moment(item.date, 'ddd MMM DD YYYY HH:mm:ss');
        let ret = new Map();

        ret.set('match', title);
        ret.set('time', (time.unix() < moment().unix()) ? 'LIVE' : time.fromNow());
        ret.set('clock', time.format('HH:mm') + ' CET ');
        ret.set('link', item.link);
        ret.set('timestamp', time.unix());
        ret.set('desc', item.description);

        return ret;
    }
}