const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createRequest,
  getRequests,
  acceptRequest,
  completeRequest,
  getEligibleDonors,
  getPublicResponse,
  respondToRequest,
  getAcceptedDonors,
} = require("../controllers/requestController");

// ===============================
// Protected hospital/donor routes
// ===============================

router.post(
  "/create",
  authMiddleware,
  createRequest
);

router.get(
  "/all",
  authMiddleware,
  getRequests
);

router.put(
  "/accept",
  authMiddleware,
  acceptRequest
);

router.put(
  "/complete",
  authMiddleware,
  completeRequest
);

router.get(
  "/eligible/:requestId",
  authMiddleware,
  getEligibleDonors
);

router.get(
  "/accepted/:requestId",
  authMiddleware,
  getAcceptedDonors
);

// ===============================
// Public donor response page
// ===============================
// One common link for Accept / Decline

router.get(
  "/public/:requestId",
  getPublicResponse
);

// ===============================
// Public donor response action
// ===============================

router.post(
  "/respond",
  respondToRequest
);

module.exports = router;