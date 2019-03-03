module.exports = client => {
  let module = {};

  // selectCarts
  module.selectCarts = async (items_per_page, page) => {
    const offset = (page - 1) * items_per_page || 0;
    const products = await client.query(
      "SELECT * FROM carts ORDER BY id LIMIT ($1) OFFSET ($2);",
      [items_per_page, offset]
    );
    return products.rows;
  };

  // selectCart
  module.selectCart = async (by, parameter) => {
    let product;
    switch (by) {
      case "id":
        product = await client.query(
          "SELECT * FROM carts WHERE id=($1) LIMIT 1;",
          [parameter]
        );
        return product.rows[0];
    }
  };

  // checkCartExists
  module.checkCartExists = async user_id => {
    const cart = await client.query(
      "SELECT id FROM carts WHERE user_id=$1 AND status <> 'finished' LIMIT 1;",
      [user_id]
    );
    return cart.rows[0];
  };

  // createCart
  module.createCart = async user_id => {
    const cart = await client.query(
      "INSERT INTO carts (user_id, status) VALUES ($1, 'created') RETURNING id;",
      [user_id]
    );
    return cart.rows[0];
  };

  // insertProductToCart
  module.insertProductToCart = async (cart_id, product_id, quantity) => {
    const cart = await client.query(
      "INSERT INTO carts_products (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *;",
      [cart_id, product_id, quantity]
    );
    return cart.rows[0];
  };

  // updateQuantityProductFromCart
  module.updateQuantityProductFromCart = async (cart_id, product_id, quantity) => {
    const cart = await client.query(
      "UPDATE carts_products SET quantity=$1 WHERE cart_id=$2 AND product_id=$3 RETURNING *;",
      [quantity, cart_id, product_id]
    );
    return cart.rows[0];
  };

  // deleteProductFromCart
  module.deleteProductFromCart = async (cart_id, product_id) => {
    const cart = await client.query(
      "DELETE FROM carts_products WHERE cart_id=$1 AND product_id=$2 RETURNING *;",
      [cart_id, product_id]
    );
    return cart.rows[0];
  };

  // emptyCart
  module.emptyCart = async cart_id => {
    const cart = await client.query(
      `DELETE FROM carts_products WHERE cart_id=$1 RETURNING *;`,
      [cart_id]
    );
    return cart.rows[0];
  };

  // checkoutCart
  module.checkoutCart = async (cart_id) => {
    const cart = await client.query(
      "UPDATE carts SET status='ordered' WHERE id=$1 RETURNING *;",
      [cart_id]
    );
    return cart.rows[0];
  };

  return module;
};
