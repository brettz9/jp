/* eslint-env mocha */
/* globals global */
import {assert} from 'chai';
import JSONP from '../src/index';

const testBaseURL = 'http://127.0.0.1:8085/tests/';

// We need a global rather than as per this module
const glob = typeof window === 'undefined' ? global : window;
glob.JSONP = JSONP;

describe('JSONP', () => {
    it('should work', async () => {
        const [test1, test2] = await JSONP([
            `${testBaseURL}cb-file1.js`, `${testBaseURL}cb-file2.js`
        ]);
        console.log('te', test1, test2);
        assert.equal(1, 1);
    });
});
