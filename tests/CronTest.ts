/// <reference path="../typings/index.d.ts" />
/// <reference path="../typings/globals/object-assign/index.d.ts" />
import { Cron } from '../src/Cron';
import * as chai from 'chai';
import chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();
let assert = chai.assert;
let expect = chai.expect;

describe('Cron', () => {

    let subject: Cron;

    beforeEach(() => {
        subject = new Cron();
    });

    after(() => {
    });

    describe('#addJob', () => {
        it('should add a job to jobs', (done) => {
            subject.addJob(() => {});
            expect(subject.jobs).to.have.length.above(0);
            done();
        });
    });
});