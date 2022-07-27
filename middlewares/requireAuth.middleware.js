const logger = require('../services/logger.service');

function requireAuth(req, res, next) {
  console.log("user trying to do action = ", req.session)
  if (!req.session || !req.session.user) {
    res.status(401).end('Not authenticated, Please Login');
    return;
  }
  next();
}

function requireHost(req, res, next) {
  const user = req.session.user;
  if (!user.isHost) {
    logger.warn(user.fullname + ' Attempt to perform host action');
    res.status(403).end('Unauthorized Enough..');
    return;
  }
  next();
}

// module.exports = requireAuth

module.exports = {
  requireAuth,
  requireHost,
};
