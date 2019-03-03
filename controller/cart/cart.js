const ModelCart = require("../../model/cart/cart");
const HelperResponse = require("../helper/response");
const HelperValidation = require("../helper/validation");

module.exports = client => {
  const reply = HelperResponse();
  const validate = HelperValidation();
  const modelCart = ModelCart(client);

  let module = {};

  module.mandatoryFields = [
    "product_ids",
  ];

  // postCart
  module.postCart = async (req, res) => {
    if (!validate.allMandatoryFieldsExists(req.body, module.mandatoryFields))
      return reply.badRequest(req, res, "incomplete req.body fields");

    try {

      // TODO: add commit and rollback
      const cart = await modelCart.createCart(req.body);
      await modelCart.insertProductToCart(cart.cart_id, req.body.product_id)

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
