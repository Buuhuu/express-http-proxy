'use strict';

var assert = require('assert');
var debug = require('debug')('express-http-proxy');
var nsPerSec = 1e9;
var nsPerMs = 1e6
var msPerS = 1e3;

function defaultTimingsHandler(req, user, proxy) {
  var userDuration = user.duration ? user.duration[0] * msPerS + user.duration[1] / nsPerMs : undefined;
  var proxyDuration = proxy.duration ? proxy.duration[0] * msPerS + proxy.duration[1] / nsPerMs : undefined;
  var latency = userDuration && proxyDuration ? userDuration - proxyDuration : undefined;
  debug('userDuration: %dms, proxyDuration: %dms, latency: %dms', userDuration, proxyDuration, latency);
}

function calculateDuration(reqTime, resTime) {
  if (!resTime || !reqTime) {
    return undefined;
  }

  // [ seconds, nanoseconds ]
  assert(resTime[0] > reqTime[0] || (resTime[0] == reqTime[0] && resTime[1] > reqTime[1]), "Response time must be greater then request time")
  
  var sDiff = resTime[0] - reqTime[0];
  var nsDiff = resTime[1] - reqTime[1];
  
  if (nsDiff < 0) {
    nsDiff += nsPerSec;
  }

  return [ sDiff, nsDiff ];
}

function reportTimings(Container) {
  (Container.options.timingsHandler || defaultTimingsHandler)(
    Container.user.req, 
    { 
      reqTime: Container.user.reqTime, 
      resTime: Container.user.resTime,
      duration: calculateDuration(Container.user.reqTime, Container.user.resTime),
    },
    {
      reqTime: Container.proxy.reqTime, 
      resTime: Container.proxy.resTime,
      duration: calculateDuration(Container.proxy.reqTime, Container.proxy.resTime),
    }
  );
  
  return Promise.resolve(Container);
}


module.exports = reportTimings;
