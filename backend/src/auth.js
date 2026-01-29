module.exports = function (req, res, next) {
  const key = req.headers["x-api-key"];

  if (key !== "secret123") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};
