const ModelAuthUser = require("./../../model/auth/user");
const HelperResponse = require("./../helper/response");

module.exports = client => {
  const reply = HelperResponse();
  const modelAuthUser = ModelAuthUser(client);

  let module = {};

  module.generateToken = size => {
    return Array(size)
      .fill(0)
      .map(() =>
        Math.random()
          .toString(36)
          .charAt(2)
      )
      .join("");
  };

  // User Authorization
  // Populating empty tokens
  module.populate = async () => {
    const users = await modelAuthUser.getUsersWithEmptyAccessTokens();
    users.map(async row => {
      const token64 = module.generateToken(64);
      try {
        await modelAuthUser.fillToken(token64, row.id);
        console.log(`Populated token for userId:${row.id}`);
      } catch (e) {
        console.error(e);
      }
    });
  };

  // Token Authorization - Using DB. Warning: not scalable.
  module.tokenAuth = async (req, res, next) => {
    if (
      req.headers.user_email === undefined ||
      req.headers.access_token === undefined
    ) {
      return reply.unauthorized(
        req,
        res,
        "undefined user_email or access_token in header"
      );
    } else {
      // queries DB token
      try {
        const access_token = await modelAuthUser.getToken(
          "email",
          req.headers.user_email
        );
        // wrong email
        if (access_token.length === 0) {
          return reply.unauthorized(req, res, "wrong user_email");
        }
        // wrong access_token
        if (req.headers.access_token !== access_token[0].access_token) {
          return reply.unauthorized(req, res, "wrong access_token");
        }
      } catch (e) {
        console.error(e);
        return reply.unauthorized(req, res, e);
      }
    }
    next();
  };

  return module;
};
