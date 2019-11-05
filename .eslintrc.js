module.exports = {
  "extends": ["ash-nazg"],
  "parserOptions": {
    "sourceType": "module"
  },
  "settings": {
    "polyfills": [
      'Object.entries',
      'Promise',
      'Promise.all'
    ]
  },
  overrides: [{
    files: ["test/**"],
    globals: {
      expect: true
    }
  }, {
    files: ["*.md"],
    globals: {
      urlStringOrArrayOfURLs: true,
      url: true,
      options: true,
      params: true,
      callback: true,
      callbackName: true,
      callbackParam: true,
      baseObject: true,
      obj: true,
      someClass: true,
      JSONP: true
    },
    rules: {
      'import/no-unresolved': 0,
      'promise/catch-or-return': 0,
      'promise/always-return': 0,
      'no-unused-vars': ['error', {
        argsIgnorePattern: 'data|resolve|reject|result|response\\d',
        varsIgnorePattern: 'JSONP'
      }]
    }
  }],
  "env": {
    "node": false,
    "browser": true
  },
  "rules": {
  }
};
