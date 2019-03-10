const ModelCart = require("../../model/cart/cart");
const HelperResponse = require("../helper/response");
const HelperValidation = require("../helper/validation");

module.exports = client => {
  const reply = HelperResponse();
  const validate = HelperValidation();
  const modelCart = ModelCart(client);

  let module = {};

  module.mandatoryFields = ["product_id", "user_id", "quantity"];

  // getCarts
  module.getCarts = async (req, res) => {
    if (req.params.items_per_page < 0 || req.params.items_per_page <= 0)
      return reply.badRequest(
        req,
        res,
        "invalid parameter items_per_page or page"
      );

    try {
      const carts = await modelCart.selectCarts(
        req.params.items_per_page,
        req.params.page
      );
      return reply.success(req, res, carts);
    } catch (e) {
      return reply.error(req, res, e);
    }
  };

  // getCart
  module.getCart = async (req, res) => {
    if (req.params.id <= 0)
      return reply.badRequest(req, res, "invalid parameter id");

    try {
      const product = await modelCart.selectCart("id", req.params.id);
      if (product === undefined)
        return reply.notFound(req, res, "product not found in db");
      else return reply.success(req, res, product);
    } catch (e) {
      return reply.error(req, res, e);
    }
  };

  // getCartDetails
  module.getCartDetails = async (req, res) => {
    if (req.params.id <= 0)
      return reply.badRequest(req, res, "invalid parameter id");

    try {
      const product = await modelCart.getCartDetailsFromUserId(req.params.id);
      if (product === undefined)
        return reply.notFound(req, res, "product not found in db");
      else return reply.success(req, res, product);
    } catch (e) {
      return reply.error(req, res, e);
    }
  };

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

      // check if product exists in cart
      const cartProductExists =
        (await modelCart.checkProductCartExists(
          existingCart.id,
          req.body.product_id
        )) === 1
          ? true
          : false;
      console.log(cartProductExists);
      let cart;
      if (cartProductExists) {
        // update
        cart = await modelCart.updateQuantityProductFromCart(
          existingCart.id,
          req.body.product_id,
          req.body.quantity
        );
      } else {
        // insert
        cart = await modelCart.insertProductToCart(
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
