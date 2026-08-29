const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createRequest,
  getRequests,
  acceptRequest,
  completeRequest,
  getEligibleDonors,
} = require("../controllers/requestController");

router.post("/create", authMiddleware, createRequest);

router.get("/all", authMiddleware, getRequests);

router.put("/accept", authMiddleware, acceptRequest);

router.put("/complete", authMiddleware, completeRequest);

router.get("/eligible/:requestId", authMiddleware, getEligibleDonors);

module.exports = router;