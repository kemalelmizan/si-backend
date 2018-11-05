module.exports = () => {
  let module = {};

  module.success = (req, res, data) => {
    console.log("success", req.url, JSON.stringify(req.headers));
    if (!res.headersSent) {
      res.header("Content-Type", "application/json");
      res.status(200);
      return res.json({ data: data });
    }
  };

  module.error = (req, res, e) => {
    console.log("error", e, req.url, JSON.stringify(req.headers));
    if (!res.headersSent) {
      res.status(500);
      return res.json({ error: "Internal server error" });
    }
  };

  module.unauthorized = (req, res, reason = "") => {
    console.log("unauthorized", reason, req.url, JSON.stringify(req.headers));
    if (!res.headersSent) {
      res.status(400);
      return res.json({ error: "Unauthorized" });
    }
  };

  module.badRequest = (req, res, reason = "") => {
    console.log("badRequest", reason, req.url, JSON.stringify(req.headers));
    if (!res.headersSent) {
      res.status(400);
      return res.json({ error: "Bad request" });
    }
  };

  return module;
};
