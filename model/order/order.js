module.exports = client => {
  let module = {};

  // selectOrders
  module.selectOrders = async (items_per_page, page) => {
    const offset = (page - 1) * items_per_page || 0;
    const products = await client.query(
      "SELECT * FROM orders ORDER BY id LIMIT ($1) OFFSET ($2);",
      [items_per_page, offset]
    );
    return products.rows;
  };

  // selectOrder
  module.selectOrder = async (by, parameter) => {
    let product;
    switch (by) {
      case "id":
        product = await client.query(
          "SELECT * FROM orders WHERE id=($1) LIMIT 1;",
          [parameter]
        );
        return product.rows[0];
    }
  };

  // createOrder
  module.createOrder = async body => {
    const order = await client.query(
      "INSERT INTO orders (user_id, cart_id, order_detail, order_status, payment_amount, payment_status) VALUES ($1, $2, $3, 'created', $4, 'not paid') RETURNING *;",
      [body.user_id, body.cart_id, body.order_detail, body.payment_amount]
    );
    return order.rows[0];
  };

  // getProductsFromOrder
  module.getProductsFromOrder = async order_id => {
    const order_products = await client.query(
      "select o.*, p.* from orders o left join carts_products cp on o.cart_id=cp.cart_id left join products p on cp.product_id=p.id where o.id=$1",
      [order_id]
    );
    return order_products.rows;
  };

  return module;
};
