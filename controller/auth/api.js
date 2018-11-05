const HelperResponse = require("./../helper/response");

// API Authorization
module.exports = (req, res, next) => {
  const reply = HelperResponse();
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization !== process.env.API_TOKEN
  ) {
    return reply.unauthorized(req, res, "invalid authorization header");
  }
  next();
};
