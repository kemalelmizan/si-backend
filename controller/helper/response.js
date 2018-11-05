module.exports = () => {
  let module = {};

  module.success = (req, res, data) => {
    console.log('200', req.role, req.method, req.url, JSON.stringify(req.headers));
    if (!res.headersSent) {
      res.header("Content-Type", "application/json");
      res.status(200);
      return res.json({ data: data });
    }
  };

  module.created = (req, res, data) => {
    console.log('201', req.role, req.method, req.url, JSON.stringify(req.headers));
    if (!res.headersSent) {
      res.header("Content-Type", "application/json");
      res.status(201);
      return res.json({ data: data });
    }
  };

  module.error = (req, res, e) => {
    console.log('500', e, req.role, req.method, req.url, JSON.stringify(req.headers));
    if (!res.headersSent) {
      res.status(500);
      return res.json({ error: "Internal server error" });
    }
  };

  module.unauthorized = (req, res, reason = "") => {
    console.log('401', reason, req.role, req.method, req.url, JSON.stringify(req.headers));
    if (!res.headersSent) {
      res.status(401);
      return res.json({ error: "Unauthorized" });
    }
  };

  module.badRequest = (req, res, reason = "") => {
    console.log('400', reason, req.role, req.method, req.url, JSON.stringify(req.headers));
    if (!res.headersSent) {
      res.status(400);
      return res.json({ error: "Bad request" });
    }
  };

  module.notFound = (req, res, reason = "") => {
    console.log('404', reason, req.role, req.method, req.url, JSON.stringify(req.headers));
    if (!res.headersSent) {
      res.status(404);
      return res.json({ error: "Not found" });
    }
  };

  return module;
};
