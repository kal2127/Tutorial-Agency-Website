const dotenv = require("dotenv");
dotenv.config();

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),

  db: {
    host: required("DB_HOST"),
    port: Number(process.env.DB_PORT || 3306),
    user: required("DB_USER"),
    password: process.env.DB_PASSWORD ?? "",
    name: required("DB_NAME"),
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  },

  jwt: {
    secret: required("JWT_SECRET"),
  },
  EMAIL_HOST: required("EMAIL_HOST"),
  EMAIL_PORT: required("EMAIL_PORT"),
  EMAIL_USER: required("EMAIL_USER"),
  EMAIL_PASS: required("EMAIL_PASS"),
  EMAIL_FROM: required("EMAIL_FROM"),
};

module.exports = env;
