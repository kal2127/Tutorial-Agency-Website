const jwt = require("jsonwebtoken");
const env = require("../config/env");
const HttpError = require("../utils/httpError");

function authRequired(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Missing token"));
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, env.jwt.secret);
    req.user = {
      id: payload.sub,
      role: payload.role,
    };
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired token"));
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return next(new HttpError(401, "Unauthorized"));
    if (req.user.role !== role) return next(new HttpError(403, "Forbidden"));
    next();
  };
}

module.exports = { authRequired, requireRole };