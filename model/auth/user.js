module.exports = client => {
  let module = {};

  // getUsersWithEmptyAccessTokens
  module.getUsersWithEmptyAccessTokens = async () => {
    const users = await client.query(
      "SELECT id FROM users WHERE access_token IS NULL;"
    );
    return users.rows;
  };

  // fillToken
  module.fillToken = async (token64, user_id) => {
    const createdToken = await client.query(
      "UPDATE users SET access_token=($1) WHERE id=($2) AND access_token IS NULL RETURNING access_token;",
      [token64, user_id]
    );
    return createdToken.rows.access_token;
  };

  // getToken
  module.getToken = async (by, parameter) => {
    switch (by) {
      case "email":
        const token = await client.query(
          "SELECT access_token FROM users WHERE email=($1);",
          [parameter]
        );
        return token.rows;
    }
  };

  return module;
};
