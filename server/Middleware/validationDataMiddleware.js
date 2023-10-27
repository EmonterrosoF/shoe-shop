export const ValidateData = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      params: req.params,
    });

    // req.query = schema.parse(req.query);
    next();
  } catch (err) {
    return res.status(400).send(err.errors);
  }
};
