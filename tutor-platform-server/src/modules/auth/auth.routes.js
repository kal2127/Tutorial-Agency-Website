const router = require("express").Router();
const { registerFamily, registerTutor, login } = require("./auth.controller");

router.post("/register-family", registerFamily);
router.post("/register-tutor", registerTutor);
router.post("/login", login);

module.exports = router;
