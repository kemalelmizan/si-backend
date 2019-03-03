const ModelOrder = require("./../../model/order/order");
const ModelCart = require("./../../model/cart/cart");
const HelperResponse = require("./../helper/response");
const HelperValidation = require("./../helper/validation");

module.exports = client => {
  const reply = HelperResponse();
  const validate = HelperValidation();
  const modelOrder = ModelOrder(client);
  const modelCart = ModelCart(client);

  let module = {};

  module.mandatoryFields = [
    "user_id",
    "cart_id",
    "order_detail",
    "payment_amount"
  ];

  module.checkout = async (req, res) => {
    if (!validate.allMandatoryFieldsExists(req.body, module.mandatoryFields))
      return reply.badRequest(req, res, "incomplete req.body fields");

    try {
      await client.query("BEGIN");

      await modelCart.checkoutCart(req.body.cart_id);
      const order = await modelOrder.createOrder(req.body);

      await client.query("COMMIT");
      return reply.created(req, res, order);
    } catch (e) {
      await client.query("ROLLBACK");
      return reply.error(req, res, e);
    }
  };

  return module;
};
