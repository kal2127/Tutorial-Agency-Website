const { success } = require("zod");
const { query } = require("../../db/query");
const HttpError = require("../../utils/httpError");
const {
  updateTutorProfileSchema,
  updateAvailabilitySchema,
  listTutorsQuerySchema,
} = require("./tutors.validators");

async function getMyTutorProfile(req, res, next) {
  try {
    const tutorId = req.user.id;

    const rows = await query(
      `SELECT 
         u.id,
         u.full_name,
         u.email,
         u.phone,
         u.role,
         u.is_active,
         tp.bio,
         tp.location_city,
         tp.location_area,
         tp.education,
         tp.experience_years,
         tp.hourly_rate,
         tp.status,
         tp.is_available,
         tb.registration_paid,
         tb.next_renewal_date,
         tb.billing_status
       FROM users u
       INNER JOIN tutor_profiles tp ON tp.tutor_id = u.id
       INNER JOIN tutor_billing tb ON tb.tutor_id = u.id
       WHERE u.id = ? AND u.role = 'TUTOR'`,
      [tutorId],
    );

    if (rows.length === 0) {
      throw new HttpError(404, "Tutor profile not found");
    }

    res.json({
      success: true,
      profile: rows[0],
    });
  } catch (e) {
    next(e);
  }
}

async function updateMyTutorProfile(req, res, next) {
  try {
    const tutorId = req.user.id;
    const data = updateTutorProfileSchema.parse(req.body);

    const existing = await query(
      "SELECT tutor_id FROM tutor_profiles WHERE tutor_id = ?",
      [tutorId],
    );

    if (existing.length === 0) {
      throw new HttpError(404, "Tutor profile not found");
    }

    await query(
      `UPDATE tutor_profiles
       SET bio = COALESCE(?, bio),
           location_city = COALESCE(?, location_city),
           location_area = COALESCE(?, location_area),
           education = COALESCE(?, education),
           experience_years = COALESCE(?, experience_years),
           hourly_rate = COALESCE(?, hourly_rate)
       WHERE tutor_id = ?`,
      [
        data.bio ?? null,
        data.location_city ?? null,
        data.location_area ?? null,
        data.education ?? null,
        data.experience_years ?? null,
        data.hourly_rate ?? null,
        tutorId,
      ],
    );

    res.json({
      success: true,
      message: "Tutor profile updated successfully",
    });
  } catch (e) {
    if (e?.name === "ZodError") {
      return next(new HttpError(400, "Validation error", e.errors));
    }
    next(e);
  }
}

async function updateTutorAvailability(req, res, next) {
  try {
    const tutorId = req.user.id;
    const data = updateAvailabilitySchema.parse(req.body);

    const existing = await query(
      "SELECT tutor_id FROM tutor_profiles WHERE tutor_id = ?",
      [tutorId],
    );

    if (existing.length === 0) {
      throw new HttpError(404, "Tutor profile not found");
    }

    await query(
      `UPDATE tutor_profiles
       SET is_available = ?
       WHERE tutor_id = ?`,
      [data.is_available ? 1 : 0, tutorId],
    );

    res.json({
      success: true,
      message: `Tutor availability updated to ${data.is_available ? "ACTIVE" : "INACTIVE"}`,
      is_available: data.is_available,
    });
  } catch (e) {
    if (e?.name === "ZodError") {
      return next(new HttpError(400, "Validation error", e.issues || e.errors));
    }
    next(e);
  }
}

async function listPublicTutors(req, res, next) {
  try {
    const filters = listTutorsQuerySchema.parse(req.query);

    let sql = `
      SELECT
        u.id,
        u.full_name,
        tp.bio,
        tp.location_city,
        tp.location_area,
        tp.education,
        tp.experience_years,
        tp.hourly_rate,
        tp.is_available,
        tp.status
      FROM users u
      INNER JOIN tutor_profiles tp ON tp.tutor_id = u.id
      WHERE u.role = 'TUTOR'
        AND tp.status = 'APPROVED'
        AND tp.is_available = 1
    `;

    const params = [];

    if (filters.location_city) {
      sql += ` AND tp.location_city = ?`;
      params.push(filters.location_city);
    }

    if (filters.location_area) {
      sql += ` AND tp.location_area = ?`;
      params.push(filters.location_area);
    }

    if (filters.min_rate !== undefined) {
      sql += ` AND tp.hourly_rate >= ?`;
      params.push(filters.min_rate);
    }

    if (filters.max_rate !== undefined) {
      sql += ` AND tp.hourly_rate <= ?`;
      params.push(filters.max_rate);
    }

    sql += ` ORDER BY u.id DESC`;

    const rows = await query(sql, params);

    res.json({
      success: true,
      count: rows.length,
      tutors: rows,
    });
  } catch (e) {
    if (e?.name === "ZodError") {
      return next(new HttpError(400, "Validation error", e.issues || e.errors));
    }
    next(e);
  }
}

async function getPublicTutorById(req, res, next) {
  try {
    const tutorId = Number(req.params.id);

    if (!Number.isInteger(tutorId) || tutorId <= 0) {
      throw new HttpError(400, "Invalid tutor id");
    }

    const rows = await query(
      `SELECT
         u.id,
         u.full_name,
         tp.bio,
         tp.location_city,
         tp.location_area,
         tp.education,
         tp.experience_years,
         tp.hourly_rate,
         tp.is_available,
         tp.status
       FROM users u
       INNER JOIN tutor_profiles tp ON tp.tutor_id = u.id
       WHERE u.id = ?
         AND u.role = 'TUTOR'
         AND tp.status = 'APPROVED'
         AND tp.is_available = 1`,
      [tutorId],
    );

    if (rows.length === 0) {
      throw new HttpError(404, "Tutor not found");
    }

    res.json({
      success: true,
      tutor: rows[0],
    });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getMyTutorProfile,
  updateMyTutorProfile,
  updateTutorAvailability,
  listPublicTutors,
  getPublicTutorById,
};
