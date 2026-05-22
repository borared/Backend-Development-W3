export default function logger(req, res, next) {
  const method = req.method;
  const path = req.path;
  const query = JSON.stringify(req.query);
  const timestamp = new Date().toISOString();
  console.log(`[EX-3] ${timestamp} - ${method} ${path} - query=${query}`);
  next();
}
