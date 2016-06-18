'use strict';

const config = require('../config/hue.js');
const HueUtil = require('hue-util');
const EventEmitter = require('events').EventEmitter;

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
};