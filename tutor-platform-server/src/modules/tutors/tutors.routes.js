const router = require("express").Router();
const {
  getMyTutorProfile,
  updateMyTutorProfile,
  updateTutorAvailability,
  listPublicTutors,
  getPublicTutorById,
} = require("./tutors.controller");
const { authRequired, requireRole } = require("../../middleware/authRequired");

// protected tutor routes first
router.get("/profile", authRequired, requireRole("TUTOR"), getMyTutorProfile);

router.patch(
  "/profile",
  authRequired,
  requireRole("TUTOR"),
  updateMyTutorProfile,
);

router.patch(
  "/profile/availability",
  authRequired,
  requireRole("TUTOR"),
  updateTutorAvailability,
);

// public routes after
router.get("/", listPublicTutors);
router.get("/:id", getPublicTutorById);

module.exports = router;
