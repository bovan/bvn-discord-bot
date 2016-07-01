/// <reference path="globals/node/index.d.ts" />
/// <reference path="globals/object-assign/index.d.ts" />
/// <reference path="globals/tinycolor/index.d.ts" />
/// <reference path="hue-util.d.ts" />
/// <reference path="feedparser.d.ts" />
/// <reference path="discord.d.ts" />
/// <reference path="modules/request/index.d.ts" />

interface HueOptions {
    useGroup: boolean;
    on: boolean;
    color: string;
    transitiontime: number;
    lightNumber: number[];
    brightness: number;
}