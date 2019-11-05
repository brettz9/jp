/* eslint-env mocha */
/* globals global */
import JSONP from '../src/index.js';

const testBaseURL = 'http://127.0.0.1:8085/test/fixtures/';

// We need a global rather than as per this module
const glob = typeof window === 'undefined' ? global : window;
glob.JSONP = JSONP;

describe('JSONP', () => {
  it('should work', async () => {
    const [test1, test2] = await JSONP([
      `${testBaseURL}cb-file1.js`, `${testBaseURL}cb-file2.js`
    ]);
    expect(test1).to.deep.equal({test: 'cb1'});
    expect(test2).to.deep.equal({test: 'cb2'});
  });
});
