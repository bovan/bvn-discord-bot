/// <reference path="../typings/index.d.ts" />
/// <reference path="../typings/globals/object-assign/index.d.ts" />
import { HueManager, HueOptions } from '../lib/HueManager';
import * as chai from 'chai';
import chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();
let assert = chai.assert;
let expect = chai.expect;

describe('HueManager', () => {

    let subject: HueManager;

    beforeEach(() => {
        subject = new HueManager();
    });

    after(() => {
        let hue = new HueManager();
        hue.setLight({lightNumber: 3, on: false})
    })

    describe('#setLight', () => {
        context('when calling', () => {
            it('should set light without error', (done) => {
                let hue = new HueManager();
                hue.setLight({lightNumber: 3})
                .then((resp: any) => {
                    let keys = Object.keys(resp);
                    assert.equal(5, keys.length, "response should have 5 keys");
                    keys.forEach((key) => {
                        expect(resp[key].hasOwnProperty('success'), 'all keys should be success');
                    })
                    done();
                },  (error) => {
                    console.log("#ERROR");
                    assert.fail(error);
                    done();
                });
            });
        });
    });

})