const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query } = require("../../db/query");
const env = require("../../config/env");
const HttpError = require("../../utils/httpError");
const {
  registerFamilySchema,
  registerTutorSchema,
  loginSchema,
} = require("./auth.validators");

async function registerFamily(req, res, next) {
  try {
    const data = registerFamilySchema.parse(req.body);

    // Check if email already exists
    const existing = await query("SELECT id FROM users WHERE email = ?", [
      data.email,
    ]);
    if (existing.length > 0)
      throw new HttpError(409, "Email already registered");

    const password_hash = await bcrypt.hash(data.password, 10);

    const result = await query(
      `INSERT INTO users (role, full_name, email, phone, password_hash)
       VALUES ('FAMILY', ?, ?, ?, ?)`,
      [data.full_name, data.email, data.phone, password_hash],
    );

    res.status(201).json({ success: true, userId: result.insertId });
  } catch (e) {
    // Zod throws its own error type; make it a clean 400
    if (e?.name === "ZodError")
      return next(new HttpError(400, "Validation error", e.errors));
    next(e);
  }
}

/**
 * Tutor registration creates:
 * - users row (role=TUTOR)
 * - tutor_profiles row (status=PENDING)
 * - tutor_billing row (SUSPENDED until payment + approval)
 */
async function registerTutor(req, res, next) {
  try {
    const data = registerTutorSchema.parse(req.body);

    const existing = await query("SELECT id FROM users WHERE email = ?", [
      data.email,
    ]);
    if (existing.length > 0)
      throw new HttpError(409, "Email already registered");

    const password_hash = await bcrypt.hash(data.password, 10);

    // Create tutor user
    const userResult = await query(
      `INSERT INTO users (role, full_name, email, phone, password_hash)
       VALUES ('TUTOR', ?, ?, ?, ?)`,
      [data.full_name, data.email, data.phone || null, password_hash],
    );
    const tutorId = userResult.insertId;

    // Create profile
    await query(
      `INSERT INTO tutor_profiles
        (tutor_id, bio, location_city, location_area, education, experience_years, hourly_rate, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
      [
        tutorId,
        data.bio || null,
        data.location_city,
        data.capable_location_area,
        data.education,
        data.experience_years,
        data.hourly_rate,
      ],
    );

    // Create billing row
    await query(
      `INSERT INTO tutor_billing (tutor_id, registration_paid, next_renewal_date, billing_status)
       VALUES (?, 0, NULL, 'SUSPENDED')`,
      [tutorId],
    );

    res.status(201).json({ success: true, tutorId, status: "PENDING" });
  } catch (e) {
    if (e?.name === "ZodError")
      return next(new HttpError(400, "Validation error", e.errors));
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);

    const rows = await query(
      "SELECT id, role, full_name, email, password_hash, is_active FROM users WHERE email = ?",
      [data.email],
    );
    if (rows.length === 0)
      throw new HttpError(401, "Invalid email or password");

    const user = rows[0];
    if (!user.is_active) throw new HttpError(403, "Account is disabled");

    const ok = await bcrypt.compare(data.password, user.password_hash);
    if (!ok) throw new HttpError(401, "Invalid email or password");

    // Why JWT?
    // - Client stores token and sends it on each request.
    // - Server verifies it without storing sessions.
    const token = jwt.sign({ sub: user.id, role: user.role }, env.jwt.secret, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        role: user.role,
        full_name: user.full_name,
        email: user.email,
      },
    });
  } catch (e) {
    if (e?.name === "ZodError")
      return next(new HttpError(400, "Validation error", e.errors));
    next(e);
  }
}

module.exports = { registerFamily, registerTutor, login };
