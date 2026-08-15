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

router.post("/create", createRequest);
router.get("/all", getRequests);
router.put("/accept", acceptRequest);
router.put("/complete", completeRequest);
router.get("/eligible/:requestId", getEligibleDonors);

module.exports = router;