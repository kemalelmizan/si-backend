const ModelUser = require("./../../model/user/user");
const ModelAuthUser = require("./../../model/auth/user");

const HelperResponse = require("./../helper/response");
const HelperValidation = require("./../helper/validation");
const AuthUser = require("./../auth/user");

module.exports = client => {
  const modelUser = ModelUser(client);
  const modelAuthUser = ModelAuthUser(client);

  const reply = HelperResponse();
  const validate = HelperValidation();
  const authUser = AuthUser(client);

  let module = {};

  module.mandatoryFields = [
    "username",
    "firstname",
    "lastname",
    "email",
    "role"
  ];

  // getUsers
  module.getUsers = async (req, res) => {
    req.query.items_per_page = parseInt(req.query.items_per_page);
    req.query.page = parseInt(req.query.page);
    if (req.params.items_per_page < 0 || req.params.items_per_page <= 0)
      return reply.badRequest(
        req,
        res,
        "invalid parameter items_per_page or page"
      );

    try {
      const users = await modelUser.selectUsers(
        req.params.items_per_page,
        req.params.page
      );
      return reply.success(req, res, users);
    } catch (e) {
      return reply.error(req, res, e);
    }
  };

  // getUser
  module.getUser = async (req, res) => {
    req.query.id = parseInt(req.query.id);
    if (req.params.id <= 0)
      return reply.badRequest(req, res, "invalid parameter id");

    try {
      const user = await modelUser.selectUser("id", req.params.id);
      if (user === undefined)
        return reply.notFound(req, res, "user not found in db");
      else return reply.success(req, res, user);
    } catch (e) {
      return reply.error(req, res, e);
    }
  };

  // postUser
  module.postUser = async (req, res) => {
    if (!validate.allMandatoryFieldsExists(req.body, module.mandatoryFields))
      return reply.badRequest(req, res, "incomplete req.body fields");

    try {
      const user = await modelUser.insertUser(req.body);

      // fill token for created user
      await modelAuthUser.fillToken(authUser.generateToken(64), user.id);

      return reply.created(req, res, user);
    } catch (e) {
      return reply.error(req, res, e);
    }
  };

  // patchUser
  module.patchUser = async (req, res) => {
    req.params.id = parseInt(req.params.id);
    if (req.params.id <= 0)
      return reply.badRequest(req, res, "invalid parameter id");

    if (!validate.allMandatoryFieldsExists(req.body, module.mandatoryFields))
      return reply.badRequest(req, res, "incomplete req.body fields");

    try {
      const user = await modelUser.updateUser(req.params.id, req.body);
      return reply.created(req, res, user);
    } catch (e) {
      return reply.error(req, res, e);
    }
  };

  // deleteUser
  module.deleteUser = async (req, res) => {
    req.params.id = parseInt(req.params.id);
    if (req.params.id <= 0)
      return reply.badRequest(req, res, "invalid parameter id");

    try {
      const user = await modelUser.deleteUser(req.params.id);
      return reply.created(req, res, user);
    } catch (e) {
      return reply.error(req, res, e);
    }
  };

  return module;
};
