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
    req.params.id = parseInt(req.params.id);
    if (req.params.id <= 0)
      return reply.badRequest(req, res, "invalid parameter id");

    try {
      const product = await modelProduct.getProduct("id", req.params.id);
      return reply.success(req, res, product);
    } catch (e) {
      return reply.error(req, res, e);
    }
  };

  // postProduct
  module.postProduct = async (req, res) => {
    // TODO: validate body input

    try {
      const product = await modelProduct.insertProduct(req.body);
      return reply.created(req, res, product);
    } catch (e) {
      return reply.error(req, res, e);
    }
  };

  // patchProduct
  module.patchProduct = async (req, res) => {
    req.params.id = parseInt(req.params.id);
    if (req.params.id <= 0)
      return reply.badRequest(req, res, "invalid parameter id");
    // TODO: validate body input

    try {
      const product = await modelProduct.updateProduct(req.params.id, req.body);
      return reply.created(req, res, product);
    } catch (e) {
      return reply.error(req, res, e);
    }
  };

  // deleteProduct
  module.deleteProduct = async (req, res) => {
    req.params.id = parseInt(req.params.id);
    if (req.params.id <= 0)
      return reply.badRequest(req, res, "invalid parameter id");
    // TODO: validate body input

    try {
      const product = await modelProduct.deleteProduct(req.params.id);
      return reply.created(req, res, product);
    } catch (e) {
      return reply.error(req, res, e);
    }
  };

  return module;
};
