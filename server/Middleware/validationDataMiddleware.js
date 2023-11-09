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

      if (type === "file") {
        req.file = schema.parse(req.file);
      }

      next();
    } catch (err) {
      res.status(400);
      console.error(err.errors[0]);

      return next(err.errors[0]);
    }
  };
