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

  // createCart
  module.createCart = async body => {
    const product = await client.query(
      "INSERT INTO carts (user_id) VALUES ($1) RETURNING *;",
      [body.user]
    );
    return product.rows[0];
  };

  // insertProductToCart
  module.insertProductToCart = async (cart_id, product_id) => {
    const product = await client.query(
      "INSERT INTO carts_products (cart_id, product_id) VALUES ($1, $2) RETURNING *;",
      [cart_id, product_id]
    );
    return product.rows[0];
  };

  // deleteProductFromCart
  module.deleteProductFromCart = async body => {
    const product = await client.query(
      "DELETE FROM carts_products WHERE cart_id=$1 AND product_id=$2 RETURNING *;",
      [body.user]
    );
    return product.rows[0];
  };

  // emptyCart
  module.emptyCart = async id => {
    const product = await client.query(
      `DELETE FROM carts_products WHERE cart_id=$1 RETURNING *;`,
      [id]
    );
    return product.rows[0];
  };

  return module;
};
