'use strict';

function sendUserRes(Container) {
  if (!Container.user.res.headersSent) {
    return new Promise(function(resolve) {
      Container.proxy.res.on('end', function() { Container.proxy.resTime = process.hrtime(); })
      Container.user.res.on('close', function() {
        Container.user.resTime = process.hrtime();
        resolve(Container);
      });

      if (Container.options.stream) {
        Container.proxy.res.pipe(Container.user.res);
      } else {
        Container.user.res.send(Container.proxy.resData);
      }
    });
  } else {
    return Promise.resolve(Container);
  }
}


module.exports = sendUserRes;
