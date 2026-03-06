const router = require("express").Router();
const { uploadReceipt } = require("../../config/upload");
const {
  createFamilyBooking,
  attachReceipt,
} = require("./bookings.controller");
const { authRequired, requireRole } = require("../../middleware/authRequired");

router.post(
  "/bookings",
  authRequired,
  requireRole("FAMILY"),
  createFamilyBooking
);

router.post(
  "/bookings/:id/receipt",
  authRequired,
  requireRole("FAMILY"),
  uploadReceipt.single("receipt"),
  attachReceipt
);

module.exports = router;