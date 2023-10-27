export const ValidateData =
  ({ schema, type = "body" }) =>
  (req, res, next) => {
    try {
      if (type === "body") {
        req.body = schema.parse(req.body);
      }

      if (type === "query") {
        req.query = schema.parse(req.query);
      }

      if (type === "params") {
        req.params = schema.parse(req.params);
      }

      next();
    } catch (err) {
      return res.status(400).send(err.errors);
    }
  };
