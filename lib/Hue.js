'use strict';

const config = require('../config/hue.js');
const HueUtil = require('hue-util');
const EventEmitter = require('events').EventEmitter;
const tinycolor = require('tinycolor2');

module.exports = class Hue extends EventEmitter {
    constructor() {
        super();
        // load config
        Object.assign(this, config);

        // light defaults
        this.options = {
            useGroup : false,
            on: true,
            color: 'red',
            transitiontime: 2,
            lightNumber: this.lights[0],
            brightness: 200
        }

        // set up hue interface
        this.hue = new HueUtil('hue-util', this.ip, this.username, this.onUsernameChange);
    }

    onUsernameChange (newUsername) {
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
    setLight (opts) {
        opts = Object.assign({}, this.options, opts);

        let p = new Promise(
            (resolve, reject) => {
                this.hue.changeLights(opts, (err, resp) => {
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

    getLights () {
        let p = new Promise(
            (resolve, reject) => {
                this.hue.getLights((err, resp) => {
                    if (err != null)
                        reject(resp);
                    else
                        resolve(resp);
                });
            }
        );

        return p;
    }

    lightToString (light) {
        let str = '';
        str += light.name + ' - ';
        str += this.lightStateToString(light.state);
        return str;
    }

    // tailored for discord output
    lightsToStrings (lights) {
        let str = "Lights:\n";
        for (let key in lights) {
            str += key + ') ' + this.lightToString(lights[key]) + "\n";
        }
        return str;
    }

    lightStateToString (state) {
        let color = {};

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