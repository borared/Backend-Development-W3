export default function auth(req, res, next) {
  const { token } = req.query;
  const validToken = "xyz123";
  if (!token || token !== validToken) {
    return res
      .status(401)
      .json({ error: "Unauthorized: invalid or missing token" });
  }
  next();
}
