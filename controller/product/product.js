const ModelProduct = require("./../../model/product/product");
const HelperResponse = require("./../helper/response");

module.exports = client => {
  const reply = HelperResponse();
  const modelProduct = ModelProduct(client);

  let module = {};

  // getProducts
  module.getProducts = async (req, res) => {
    req.query.items_per_page = parseInt(req.query.items_per_page);
    req.query.page = parseInt(req.query.page);
    if (req.params.items_per_page < 0 || req.params.items_per_page <= 0)
      return reply.badRequest(
        req,
        res,
        "invalid parameter items_per_page or page"
      );

    try {
      const products = await modelProduct.getProducts(
        req.params.items_per_page,
        req.params.page
      );
      return reply.success(req, res, products);
    } catch (e) {
      return reply.error(req, res, e);
    }
  };

  // getProduct
  module.getProduct = async (req, res) => {
    req.query.id = parseInt(req.query.id);
    if (req.params.id <= 0)
      return reply.badRequest(req, res, "invalid parameter id");

    try {
      const user = await modelProduct.getProduct("id", req.params.id);
      return reply.success(req, res, user);
    } catch (e) {
      return reply.error(req, res, e);
    }
  };

  return module;
};
