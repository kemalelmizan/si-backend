module.exports = client => {
  let module = {};

  // getRole
  module.getRole = async (by, parameter) => {
    let role;
    switch (by) {
      case "id":
        role = await client.query(
          "SELECT role FROM users WHERE id=($1) LIMIT 1;",
          [parameter]
        );
        return role.rows[0].role;
      case "email":
        role = await client.query(
          "SELECT role FROM users WHERE email=($1) LIMIT 1;",
          [parameter]
        );
        return role.rows[0].role;
    }
  };

  // selectUsers
  module.selectUsers = async (items_per_page, page) => {
    const offset = (page - 1) * items_per_page || 0;
    const users = await client.query(
      "SELECT id, username, firstname, lastname, email, role, created_at, updated_at FROM users ORDER BY id LIMIT ($1) OFFSET ($2);",
      [items_per_page, offset]
    );
    return users.rows;
  };

  // selectUser
  module.selectUser = async (by, parameter) => {
    let user;
    switch (by) {
      case "id":
        user = await client.query(
          "SELECT id, username, firstname, lastname, email, role, created_at, updated_at FROM users WHERE id=($1) LIMIT 1;",
          [parameter]
        );
        return user.rows[0];
    }
  };

  // insertUser
  module.insertUser = async body => {
    const user = await client.query(
      "INSERT INTO users (username, firstname, lastname, email, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, firstname, lastname, email, role, created_at, updated_at;",
      [body.username, body.firstname, body.lastname, body.email, body.role]
    );
    return user.rows[0];
  };

  // updateUser
  module.updateUser = async (id, body) => {
    const user = await client.query(
      `UPDATE users SET username=$1, firstname=$2, lastname=$3, email=$4, role=$5, updated_at=NOW() WHERE id=$6 RETURNING id, username, firstname, lastname, email, role, created_at, updated_at;`,
      [body.username, body.firstname, body.lastname, body.email, body.role, id]
    );
    return user.rows[0];
  };

  // deleteUser
  module.deleteUser = async id => {
    const user = await client.query(
      `DELETE FROM users WHERE id=$1 RETURNING id, username, firstname, lastname, email, role, created_at, updated_at;`,
      [id]
    );
    return user.rows[0];
  };

  return module;
};
