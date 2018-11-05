module.exports = client => {
  let module = {};

  // getRole
  module.getRole = async (by, parameter) => {
    let role;
    switch (by) {
      case "id":
        role = await client.query(
          "SELECT role FROM products WHERE id=($1) LIMIT 1;",
          [parameter]
        );
        return role.rows[0].role;
      case "email":
        role = await client.query(
          "SELECT role FROM products WHERE email=($1) LIMIT 1;",
          [parameter]
        );
        return role.rows[0].role;
    }
  };

  // getProducts
  module.getProducts = async (items_per_page, page) => {
    const offset = (page - 1) * items_per_page || 0;
    const products = await client.query(
      "SELECT * FROM products ORDER BY id LIMIT ($1) OFFSET ($2);",
      [items_per_page, offset]
    );
    return products.rows;
  };

  // getProduct
  module.getProduct = async (by, parameter) => {
    let product;
    switch (by) {
      case "id":
        product = await client.query(
          "SELECT * FROM products WHERE id=($1) LIMIT 1;",
          [parameter]
        );
        return product.rows[0];
    }
  };

  // insertProduct
  module.insertProduct = async body => {
    const product = await client.query(
      "INSERT INTO products (name, description, image_url, category, price, discounted_price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
      [
        body.name,
        body.description,
        body.image_url,
        body.category,
        body.price,
        body.discounted_price
      ]
    );
    return product.rows[0];
  };

  return module;
};
