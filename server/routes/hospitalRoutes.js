const express = require("express");

const router = express.Router();

const {
  registerHospital,
} = require("../controllers/hospitalController");

const {
  loginHospital,
} = require("../controllers/hospitalLoginController");

router.post("/register", registerHospital);

router.post("/login", loginHospital);

module.exports = router;