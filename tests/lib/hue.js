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
    t.ok(hue.setLight({lightNumber: 3, on: false}), "turning off light");
    t.end();
});

test('emits event on change', (t) => {
    let hue = new Hue();
    // 2 successful tests
    t.plan(2);
    hue.on('lightChange', () => {
        t.pass();
    });
    hue.on('lightError', () => {
        t.fail('lightError should not be emitted on success');
    });
    hue.setLight({lightNumber: 3, color: 'green'});
    hue.setLight({lightNumber: 3, on: false});
});

test('emits event on error', (t) => {
    let hue = new Hue();
    t.plan(1);
    hue.on('lightError', () => {
        t.pass();
    });
    hue.on('lightChange', () => {
        t.fail('lightChange should not be emitted on fail');
    });
    // random absurdly high number to let it fail
    hue.setLight({lightNumber: 1337, on: false});
});

test('should get async light info', (t) => {
    t.plan(2);
    let hue = new Hue();
    return hue.getLights().then((lights) => {
        t.ok((typeof lights === 'object' && lights !== null), "should return object");
        t.ok(Object.keys(lights).length > 1, "should contain more than 1 light"); // because I have 3
    });
});
