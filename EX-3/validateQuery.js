export default function validateQuery(req, res, next) {
  const { minCredits, maxCredits } = req.query;

  if (minCredits !== undefined) {
    const n = Number(minCredits);
    if (!Number.isInteger(n)) {
      return res.status(400).json({ error: "minCredits must be an integer" });
    }
  }

  if (maxCredits !== undefined) {
    const n = Number(maxCredits);
    if (!Number.isInteger(n)) {
      return res.status(400).json({ error: "maxCredits must be an integer" });
    }
  }

  if (minCredits !== undefined && maxCredits !== undefined) {
    const minN = Number(minCredits);
    const maxN = Number(maxCredits);
    if (minN > maxN) {
      return res
        .status(400)
        .json({ error: "minCredits cannot be greater than maxCredits" });
    }
  }

  next();
}
