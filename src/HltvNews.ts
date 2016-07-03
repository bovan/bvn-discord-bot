import FeedParser = require('feedparser');
import moment = require('moment');
import request = require('request');
import { RssReader, RssList } from '../lib/rssreader';

export class News extends RssReader {
    private rssReader: RssReader;

    constructor() {
        super();
        this.url = 'http://www.hltv.org/news.rss.php';
    }

    parse(item: any): Map<string, string> {
        var ret = new Map();
        let title = item.title.replace(new RegExp("No team", 'g'), '--TBD-- ');
        let time = moment(item.date, 'ddd MMM DD YYYY HH:mm:ss');
        ret.set('title', item.title);
        ret.set('time', time.format('HH:mm') + ' CET ');
        ret.set('link', item.link);
        return ret;
    }
}