const ModelOrder = require("./../../model/order/order");
const ModelCart = require("./../../model/cart/cart");
const ModelProduct = require("./../../model/product/product");
const HelperResponse = require("./../helper/response");
const HelperValidation = require("./../helper/validation");

module.exports = client => {
  const reply = HelperResponse();
  const validate = HelperValidation();
  const modelOrder = ModelOrder(client);
  const modelCart = ModelCart(client);
  const modelProduct = ModelProduct(client);

  let module = {};

  module.mandatoryFields = ["user_id", "cart_id", "order_detail"];

  module.checkout = async (req, res) => {
    if (!validate.allMandatoryFieldsExists(req.body, module.mandatoryFields))
      return reply.badRequest(req, res, "incomplete req.body fields");

    try {
      await client.query("BEGIN");

      const cart_products = await modelProduct.getPriceAndQuantityFromCart(
        req.body.cart_id
      );
      req.body.payment_amount = 0;
      cart_products.forEach(v => {
        req.body.payment_amount += v.quantity * v.discounted_price;
      });

      await modelCart.checkoutCart(req.body.cart_id);
      const order = await modelOrder.createOrder(req.body);

      await client.query("COMMIT");
      return reply.created(req, res, order);
    } catch (e) {
      await client.query("ROLLBACK");
      return reply.error(req, res, e);
    }
  };

  module.getDetails = async (req, res) => {
    if (!validate.allMandatoryFieldsExists(req.body, ["order_id"]))
      return reply.badRequest(req, res, "incomplete req.body fields");

    try {
      const order = await modelOrder.getProductsFromOrder(req.body.order_id);
      return reply.created(req, res, order);
    } catch (e) {
      return reply.error(req, res, e);
    }
  };

  return module;
};
