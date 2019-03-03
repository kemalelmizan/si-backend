const crypto = require("crypto");
const jwt = require("jsonwebtoken");

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

  module.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
      .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
      .toString("hex");
  };

  module.validatePassword = function(password) {
    const hash = crypto
      .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
      .toString("hex");
    return this.hash === hash;
  };

  module.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10)
      },
      "secret"
    );
  };

  module.toAuthJSON = function() {
    return {
      _id: this._id,
      email: this.email,
      token: this.generateJWT()
    };
  };

  return module;
};
