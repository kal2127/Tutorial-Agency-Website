const { query } = require("../../db/query");
const HttpError = require("../../utils/httpError");
const {
  createBookingSchema,
  attachReceiptSchema,
} = require("./bookings.validators");

async function createFamilyBooking(req, res, next) {
  try {
    const data = createBookingSchema.parse(req.body);
    const familyId = req.user.id;

    const tutorRows = await query(
      "SELECT id FROM users WHERE id = ? AND role = 'TUTOR'",
      [data.tutor_id]
    );

    if (tutorRows.length === 0) {
      throw new HttpError(404, "Tutor not found");
    }

    const bookingResult = await query(
      `INSERT INTO bookings
      (family_id, tutor_id, start_time, end_time, session_type, location_note, status,
       student_name, grade, curriculum, days_per_week, hours_per_day)
      VALUES (?, ?, ?, ?, ?, ?, 'PENDING_VERIFICATION', ?, ?, ?, ?, ?)`,
      [
        familyId,
        data.tutor_id,
        data.start_time,
        data.end_time,
        data.session_type,
        data.location_note || null,
        data.student_name,
        data.grade,
        data.curriculum,
        data.days_per_week,
        data.hours_per_day,
      ]
    );

    const bookingId = bookingResult.insertId;

    await query(
      `INSERT INTO booking_payments
      (booking_id, amount, status, method)
      VALUES (?, ?, 'PENDING', 'RECEIPT')`,
      [bookingId, data.amount]
    );

    res.status(201).json({
      success: true,
      bookingId,
      status: "PENDING_VERIFICATION",
      message: "Booking created. Upload receipt file and/or transaction reference.",
    });
  } catch (e) {
    if (e?.name === "ZodError") {
      return next(new HttpError(400, "Validation error", e.errors));
    }
    next(e);
  }
}

async function attachReceipt(req, res, next) {
  try {
    const bookingId = Number(req.params.id);

    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      throw new HttpError(400, "Invalid booking id");
    }

    const data = attachReceiptSchema.parse(req.body);

    const bookingRows = await query(
      "SELECT id FROM bookings WHERE id = ? AND family_id = ?",
      [bookingId, req.user.id]
    );

    if (bookingRows.length === 0) {
      throw new HttpError(404, "Booking not found");
    }

    const receiptUrl = req.file
      ? `/uploads/receipts/${req.file.filename}`
      : null;

    if (!receiptUrl && !data.transaction_ref) {
      throw new HttpError(400, "Provide receipt file and/or transaction_ref");
    }

    await query(
      `UPDATE booking_payments
       SET receipt_url = COALESCE(?, receipt_url),
           transaction_ref = COALESCE(?, transaction_ref)
       WHERE booking_id = ?`,
      [receiptUrl, data.transaction_ref || null, bookingId]
    );

    res.json({
      success: true,
      bookingId,
      receipt_url: receiptUrl,
      transaction_ref: data.transaction_ref || null,
      message: "Receipt attached successfully. Waiting for admin verification.",
    });
  } catch (e) {
    if (e?.name === "ZodError") {
      return next(new HttpError(400, "Validation error", e.errors));
    }
    next(e);
  }
}

module.exports = {
  createFamilyBooking,
  attachReceipt,
};