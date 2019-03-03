const ModelCart = require("../../model/cart/cart");
const HelperResponse = require("../helper/response");
const HelperValidation = require("../helper/validation");

module.exports = client => {
  const reply = HelperResponse();
  const validate = HelperValidation();
  const modelCart = ModelCart(client);

  let module = {};

  module.mandatoryFields = ["product_id", "user_id", "quantity"];

  // addProductToCart
  module.addProductToCart = async (req, res) => {
    if (!validate.allMandatoryFieldsExists(req.body, module.mandatoryFields))
      return reply.badRequest(req, res, "incomplete req.body fields");

    try {
      await client.query("BEGIN");
      let existingCart = await modelCart.checkCartExists(req.body.user_id);

      if (existingCart === undefined) {
        existingCart = await modelCart.createCart(req.body.user_id);
      }

      const cart = await modelCart.insertProductToCart(
        existingCart.id,
        req.body.product_id,
        req.body.quantity
      );

      await client.query("COMMIT");
      return reply.created(req, res, cart);
    } catch (e) {
      await client.query("ROLLBACK");
      return reply.error(req, res, e);
    }
  };

  // updateQuantityProductToCart
  module.updateQuantityProductToCart = async (req, res) => {
    if (!validate.allMandatoryFieldsExists(req.body, module.mandatoryFields))
      return reply.badRequest(req, res, "incomplete req.body fields");

    try {
      await client.query("BEGIN");
      const existingCart = await modelCart.checkCartExists(req.body.user_id);

      let cart;
      if (req.body.quantity == "0") {
        cart = await modelCart.deleteProductFromCart(
          existingCart.id,
          req.body.product_id
        );
      } else {
        cart = await modelCart.updateQuantityProductFromCart(
          existingCart.id,
          req.body.product_id,
          req.body.quantity
        );
      }

      await client.query("COMMIT");
      return reply.created(req, res, cart);
    } catch (e) {
      await client.query("ROLLBACK");
      return reply.error(req, res, e);
    }
  };

  module.emptyCart = async (req, res) => {
    if (!validate.allMandatoryFieldsExists(req.body, ["user_id"]))
      return reply.badRequest(req, res, "incomplete req.body fields");
    try {
      await client.query("BEGIN");
      const existingCart = await modelCart.checkCartExists(req.body.user_id);
      const cart = await modelCart.emptyCart(existingCart.id);
      await client.query("COMMIT");
      return reply.created(req, res, cart);
    } catch (e) {
      await client.query("ROLLBACK");
      return reply.error(req, res, e);
    }
  };
  return module;
};
