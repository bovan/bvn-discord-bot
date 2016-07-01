import FeedParser = require('feedparser');
import moment = require('moment');
import request = require('request');
import { RssReader, RssList } from './rssreader';

export class News extends RssReader {
    private rssReader: RssReader;

    constructor() {
        super();
        this.url = 'http://www.hltv.org/news.rss.php';
    }

    parse(item: any) {
        let title = item.title.replace(new RegExp("No team", 'g'), '--TBD-- ');
        let time = moment(item.date, 'ddd MMM DD YYYY HH:mm:ss');
        return {
            title : item.title,
            time : time.format('HH:mm') + ' CET ',
            link : item.link
        };
    }
}