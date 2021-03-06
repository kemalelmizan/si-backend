const ModelProduct = require("./../../model/product/product");
const HelperResponse = require("./../helper/response");
const HelperValidation = require("./../helper/validation");

module.exports = client => {
  const reply = HelperResponse();
  const validate = HelperValidation();
  const modelProduct = ModelProduct(client);

  let module = {};

  module.mandatoryFields = [
    "name",
    "description",
    "image_url",
    "category",
    "price",
    "discounted_price"
  ];

  // getProducts
  module.getProducts = async (req, res) => {
    if (req.params.items_per_page < 0 || req.params.items_per_page <= 0)
      return reply.badRequest(
        req,
        res,
        "invalid parameter items_per_page or page"
      );

    try {
      const products = await modelProduct.selectProducts(
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
      const product = await modelProduct.selectProduct("id", req.params.id);
      if (product === undefined)
        return reply.notFound(req, res, "product not found in db");
      else return reply.success(req, res, product);
    } catch (e) {
      return reply.error(req, res, e);
    }
  };

  // postProduct
  module.postProduct = async (req, res) => {
    if (!validate.allMandatoryFieldsExists(req.body, module.mandatoryFields))
      return reply.badRequest(req, res, "incomplete req.body fields");

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
  
    if (!validate.allMandatoryFieldsExists(req.body, module.mandatoryFields))
      return reply.badRequest(req, res, "incomplete req.body fields");

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
