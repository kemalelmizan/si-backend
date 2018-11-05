const ModelUser = require("./../../model/user/user");
const HelperResponse = require("./../helper/response");
const AdminAccess = require("../access/admin");
const SellerAccess = require("../access/seller");
const BuyerAccess = require("../access/buyer");

module.exports = client => {
  const modelUser = ModelUser(client);
  const reply = HelperResponse();

  let module = {};

  module.isAllowed = (role, module, write = false) => {
    switch (role) {
      case "admin":
        if (write) return AdminAccess.write.includes(module) ? true : false;
        else return AdminAccess.read.includes(module) ? true : false;
      case "seller":
        if (write) return SellerAccess.write.includes(module) ? true : false;
        else return SellerAccess.read.includes(module) ? true : false;
      case "buyer":
        if (write) return BuyerAccess.write.includes(module) ? true : false;
        else return BuyerAccess.read.includes(module) ? true : false;
    }
  };

  // Validate module access rights
  module.checkAccess = async (req, res, next) => {
    const urlToModuleMapping = {
      users: "user",
      user: "user",
      stores: "store",
      store: "store",
      carts: "cart",
      cart: "cart",
      orders: "order",
      order: "order",
      products: "product",
      product: "product"
    };
    const role = await modelUser.getRole("email", req.headers.user_email);
    if (
      !module.isAllowed(
        role,
        urlToModuleMapping[req.url.split("/")[1]],
        ["POST", "PUT", "PATCH", "DELETE"].includes(req.method)
      )
    ) {
      return reply.unauthorized(req, res, "violation of module access rights");
    }
    next();
  };

  return module;
};
