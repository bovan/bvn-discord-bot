'use strict';

const test = require('tape');
const Hue = require('../../lib/Hue.js');

test('hue has config settings', (t) => {
    t.plan(4);
    let hue = new Hue();
    t.ok(hue.hasOwnProperty('ip'), "ip");
    t.ok(hue.hasOwnProperty('username'), "username");
    t.ok(hue.hasOwnProperty('lights'), "lights");
    t.ok(hue.lights.length > 0, "has some lights");
});

test('can set light on', (t) => {
    let hue = new Hue();
    t.ok(hue.setLight({lightNumber: 3}), "light setting doesnt fail");
    t.end();
});