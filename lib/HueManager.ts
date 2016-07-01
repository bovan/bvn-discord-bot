/// <reference path="../typings/hue-util.d.ts"/>

import { hueConfig } from '../config/hue';
import Hue = require('hue-util');
import tinycolor = require ('tinycolor2');
import { EventEmitter } from 'events';

export class HueManager extends EventEmitter {
    private options: HueOptions;
    private ip: string;
    private username: string;
    private lights: number[];
    private mainLight: number;
    private hue: any;

    constructor() {
        super();
        // load config
        this.ip = hueConfig.ip;
        this.username = hueConfig.username;
        this.lights = hueConfig.lights;
        this.mainLight = hueConfig.mainLight;

        // light defaults
        this.options = {
            useGroup : false,
            on: true,
            color: 'red',
            transitiontime: 2,
            lightNumber: [this.mainLight],
            brightness: 200
        };

        // set up hue interface
        this.hue = new Hue('hue-util', this.ip, this.username, username => this.onUsernameChange(username));
    }
    test () {

    }

    onUsernameChange (newUsername: string) {
        this.username = newUsername;
    }

    /**
     * opts = {
     *  color: text name/hex code,
     *  transitiontime: number in seconds,
     *  lightNumber: id of light to change,
     *  brightness: 0(off) to 255(full brightness),
     *  on: true/false
     * }
     */
    setLight (opts: HueOptions) {
        opts = Object.assign({}, this.options, opts);

        let p = new Promise(
            (resolve, reject) => {
                this.hue.changeLights(opts, (err: Error, resp: Object) => {
                    if (err != null) {
                        this.emit('lightError');
                        reject(resp);
                    }
                    else {
                        this.emit('lightChange');
                        resolve(resp);
                    }
                });
            }
        );

        return p;
    }

    getLights (): Promise<HueLights> {
        let p = new Promise(
            (resolve, reject) => {
                this.hue.getLights((err: Error, resp: Object) => {
                    if (err != null)
                        reject(resp);
                    else
                        resolve(resp);
                });
            }
        );

        return p;
    }

    lightToString (light: HueLight): string {
        let str = '';
        str += light.name + ' - ';
        str += this.lightStateToString(light.state);
        return str;
    }

    // tailored for discord output
    lightsToStrings (lights: HueLights): string {
        let str = "Lights:\n";
        for (let key in lights) {
            // TODO: literals
            str += key + ') ' + this.lightToString(lights[key]) + "\n";
        }
        return str;
    }

    lightStateToString (state: HueLightState): string {
        let color: any;

        // first: off or offline
        if (state.on === false) {
            if (state.reachable === false)
                return 'offline';
            return 'off';
        }

        // colored lights
        if (state.hasOwnProperty('hue') && state.hasOwnProperty('sat')) {
            color = {
              h : (state.hue / 65535) * 360, // 360 range in tinycolor
              s : state.sat / 254, // get %,
              v : state.bri / 254/// get %
            }
        }
        else { // white lights
            color = {
                h : 0,
                s : 0,
                v : state.bri / 255
            }
        }

        // return name if available, if not just the hex code
        let c = tinycolor(color);
        if (c.toName())
            return  c.toHexString() + ' (' + c.toName() + ')';
        else
            return c.toHexString();
    }
};