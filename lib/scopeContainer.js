'use strict';
var resolveOptions = require('../lib/resolveOptions');

// The Container object is passed down the chain of Promises, with each one
// of them mutating and returning Container.  The goal is that (eventually)
// author using this library // could hook into/override any of these
// workflow steps with a Promise or simple function.
// Container for scoped arguments in a promise chain.  Each promise recieves
// this as its argument, and returns it.
//
// Do not expose the details of this to hooks/user functions.

function Container(req, res, next, host, userOptions) {
  return {
    user: {
      req: req,
      reqTime: undefined,
      res: res,
      resTime: undefined,
      next: next,
    },
    proxy: {
      req: undefined,
      reqTime: undefined, // the hrtime at which the first bytes are written to the proxy request
      res: undefined,
      resTime: undefined, // the hrtime of the 'end' event of the proxy response
      resData: undefined, // from proxy res
      bodyContent: undefined, // for proxy req
      reqBuilder: {},  // reqOpt, intended as first arg to http(s)?.request
    },
    options: resolveOptions(userOptions),
    params: {
      host: host,
      userOptions: userOptions
    }
  };
}

module.exports = Container;
