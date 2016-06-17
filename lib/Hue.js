'use strict';

const config = require('../config/hue.js');

module.exports = class Hue {
    constructor() {
        this.ip = config.ip;
        this.username = config.username;
        this.lights = config.lights;
    }
};