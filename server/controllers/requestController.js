const Request = require("../models/Request");
const Donor = require("../models/Donor");
const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");
const calculateDistance = require("../utils/calculateDistance");
const compatibility = require("../utils/bloodCompatibility");

const createRequest = async (req, res) => {
  try {
    const {
      hospital,
      bloodGroup: rawBloodGroup,
      units,
      urgency,
      doctorName,
      doctorPhone,
      radius,
    } = req.body;

    const bloodGroup = rawBloodGroup
      ? rawBloodGroup.trim().toUpperCase()
      : "";

    const numericUnits = Number(units);
    const numericRadius = Number(radius);

    if (
      !hospital ||
      !bloodGroup ||
      !numericUnits ||
      !urgency ||
      !doctorName ||
      !doctorPhone ||
      !numericRadius
    ) {
      return res.status(400).json({
        message:
          "Please provide all required blood request details.",
      });
    }

    const compatibleGroups =
      compatibility[bloodGroup] || [bloodGroup];

    const request = await Request.create({
      hospital,
      bloodGroup,
      units: numericUnits,
      urgency,
      doctorName,
      doctorPhone,
      radius: numericRadius,
    });

    const hospitalData =
      await request.populate("hospital");

    if (!hospitalData.hospital) {
      return res.status(404).json({
        message: "Hospital not found.",
      });
    }

    const today = new Date();

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(
      today.getDate() - 90
    );

    const donors = await Donor.find({
      bloodGroup: {
        $in: compatibleGroups,
      },
      consent: true,
      age: {
        $gte: 18,
        $lte: 60,
      },
      weight: {
        $gte: 50,
      },
    });

    // EXISTING ELIGIBILITY ALGORITHM - UNCHANGED
    const eligibleDonors =
      donors.filter((donor) => {
        if (
          donor.lastDonationDate &&
          donor.lastDonationDate >
          ninetyDaysAgo
        ) {
          return false;
        }

        if (
          donor.latitude == null ||
          donor.longitude == null ||
          hospitalData.hospital.latitude ==
          null ||
          hospitalData.hospital.longitude ==
          null
        ) {
          return false;
        }

        const distance =
          calculateDistance(
            hospitalData.hospital.latitude,
            hospitalData.hospital.longitude,
            donor.latitude,
            donor.longitude
          );

        return (
          distance <= numericRadius
        );
      });

    // ========================================
    // ONE COMMON RESPONSE LINK
    // ========================================

    const clientUrl =
      process.env.CLIENT_URL ||
      "http://localhost:5173";

    const responseLink =
      `${clientUrl}/respond/${request._id}`;

    // ========================================
    // EMAIL NOTIFICATIONS
    // ========================================

    for (const donor of eligibleDonors) {
      if (!donor.email) {
        console.warn(
          `⚠️ Skipping email for ${donor.name}: no email address`
        );
        continue;
      }

      const distance =
        calculateDistance(
          hospitalData.hospital.latitude,
          hospitalData.hospital.longitude,
          donor.latitude,
          donor.longitude
        );

      const emailText = `🚨 RAKTSETU – EMERGENCY BLOOD REQUIREMENT

This is an urgent blood donation request received through the RaktSetu Emergency Blood Coordination System.

Hospital: ${hospitalData.hospital.hospitalName}
Hospital Address: ${hospitalData.hospital.address || "Hospital address not available"}

Blood Group Required: ${bloodGroup}
Units Required: ${numericUnits}
Urgency: ${urgency}
Approximate Distance: ${distance.toFixed(2)} KM

If you are available and willing to respond to this emergency requirement, please use the link below:

${responseLink}

You may select ACCEPT or DECLINE on the response page.

Your timely response may help support an urgent medical requirement.

— RaktSetu Emergency Blood Services`;

      try {
        const emailResult =
          await sendEmail(
            donor.email,
            "🚨 RAKTSETU EMERGENCY BLOOD ALERT",
            emailText,
            responseLink
          );

        if (emailResult?.success) {
          console.log(
            `✅ Emergency email sent to ${donor.email}`
          );
        } else {
          console.warn(
            `⚠️ Email failed for ${donor.email}:`,
            emailResult?.error ||
            "Unknown email error"
          );
        }
      } catch (emailError) {
        console.warn(
          `⚠️ Failed to send email to ${donor.email}:`,
          emailError.message
        );
      }
    }

    // ========================================
    // SMS NOTIFICATIONS
    // Existing SMS system stays untouched
    // ========================================

    for (const donor of eligibleDonors) {
      try {
        const distance =
          calculateDistance(
            hospitalData.hospital.latitude,
            hospitalData.hospital.longitude,
            donor.latitude,
            donor.longitude
          );

        const smsText = `🚨 RAKTSETU – EMERGENCY BLOOD REQUIREMENT

This is an urgent blood donation request received through the RaktSetu Emergency Blood Coordination System.

Hospital: ${hospitalData.hospital.hospitalName}
Hospital Address: ${hospitalData.hospital.address ||
          "Hospital address not available"
          }

Blood Group Required: ${bloodGroup}
Units Required: ${numericUnits}
Urgency: ${urgency}
Approximate Distance: ${distance.toFixed(2)} KM

If you are available and willing to respond to this emergency requirement, please use the link below:

${responseLink}

You may select ACCEPT or DECLINE on the response page.

Your timely response may help support an urgent medical requirement.

— RaktSetu Emergency Blood Services`;

        const smsResult = await sendSMS(
          donor.phone,
          smsText,
          responseLink
        );

        if (smsResult?.success) {
          console.log(
            `✅ Emergency SMS sent to ${donor.phone}`
          );
        } else {
          console.warn(
            `⚠️ SMS failed for ${donor.phone}:`,
            smsResult?.error ||
            "Unknown SMS error"
          );
        }
      } catch (smsError) {
        console.warn(
          `⚠️ Failed to send SMS to donor:`,
          smsError.message
        );
      }
    }

    // ========================================
    // REAL-TIME SOCKET EVENT
    // ========================================

    const io = req.app.get("io");

    if (io) {
      io.emit("new-request", {
        hospital,
        hospitalName:
          hospitalData.hospital
            .hospitalName,
        bloodGroup,
        units: numericUnits,
        urgency,
        doctorName,
        doctorPhone,
        radius: numericRadius,
      });
    }

    return res.status(201).json({
      message: `Blood Request Created Successfully. ${eligibleDonors.length} eligible donor(s) found.`,
      request,
    });
  } catch (error) {
    console.error(
      "Error creating request:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Server Error",
    });
  }
};

const getRequests = async (req, res) => {
  try {
    let requests;

    if (
      req.user?.role ===
      "hospital"
    ) {
      requests =
        await Request.find({
          hospital: req.user.id,
        })
          .populate(
            "hospital",
            "hospitalName"
          )
          .sort({
            createdAt: -1,
          });
    } else {
      requests =
        await Request.find()
          .populate(
            "hospital",
            "hospitalName"
          )
          .sort({
            createdAt: -1,
          });
    }

    return res.json(requests);
  } catch (error) {
    console.error(
      "Error fetching requests:",
      error
    );

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// Existing logged-in donor acceptance
const acceptRequest = async (
  req,
  res
) => {
  try {
    const {
      requestId,
      donorName,
      donorPhone,
    } = req.body;

    const request =
      await Request.findById(
        requestId
      );

    if (!request) {
      return res.status(404).json({
        message: "Request Not Found",
      });
    }

    if (
      request.status ===
      "Completed"
    ) {
      return res.status(400).json({
        message:
          "This blood request is already completed.",
      });
    }

    const alreadyAccepted =
      request.acceptedDonors.find(
        (donor) =>
          donor.phone ===
          donorPhone
      );

    if (alreadyAccepted) {
      return res.status(400).json({
        message:
          "You have already accepted this request.",
      });
    }

    if (
      request.collectedUnits >=
      request.units
    ) {
      request.status =
        "Completed";

      await request.save();

      return res.status(400).json({
        message:
          "All required blood units have already been collected.",
      });
    }

    request.collectedUnits += 1;

    request.acceptedDonors.push({
      responseId:
        `dashboard-${donorPhone}-${Date.now()}`,
      name: donorName,
      phone: donorPhone,
      acceptedAt:
        new Date(),
    });

    if (
      request.collectedUnits >=
      request.units
    ) {
      request.status =
        "Completed";
    } else {
      request.status =
        "Accepted";
    }

    await request.save();

    return res.json({
      message:
        "Donation Accepted Successfully",
      collectedUnits:
        request.collectedUnits,
      requiredUnits:
        request.units,
      status:
        request.status,
    });
  } catch (error) {
    console.error(
      "Error accepting request:",
      error
    );

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const completeRequest = async (
  req,
  res
) => {
  try {
    const { requestId } =
      req.body;

    const request =
      await Request.findById(
        requestId
      );

    if (!request) {
      return res.status(404).json({
        message: "Request Not Found",
      });
    }

    request.status =
      "Completed";

    await request.save();

    return res.json({
      message:
        "Request Completed Successfully",
    });
  } catch (error) {
    console.error(
      "Error completing request:",
      error
    );

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const getEligibleDonors = async (
  req,
  res
) => {
  try {
    const request =
      await Request.findById(
        req.params.requestId
      ).populate("hospital");

    if (!request) {
      return res.status(404).json({
        message: "Request Not Found",
      });
    }

    if (!request.hospital) {
      return res.status(404).json({
        message:
          "Hospital information not found for this request.",
      });
    }

    const bloodGroup =
      request.bloodGroup
        ? request.bloodGroup
          .trim()
          .toUpperCase()
        : "";

    const compatibleGroups =
      compatibility[bloodGroup] ||
      [bloodGroup];

    const today = new Date();

    const ninetyDaysAgo =
      new Date();

    ninetyDaysAgo.setDate(
      today.getDate() - 90
    );

    const donors =
      await Donor.find({
        bloodGroup: {
          $in: compatibleGroups,
        },
        consent: true,
        age: {
          $gte: 18,
          $lte: 60,
        },
        weight: {
          $gte: 50,
        },
      });

    const eligibleDonors =
      donors.filter(
        (donor) => {
          if (
            donor.lastDonationDate &&
            donor.lastDonationDate >
            ninetyDaysAgo
          ) {
            return false;
          }

          if (
            donor.latitude == null ||
            donor.longitude == null ||
            request.hospital
              .latitude == null ||
            request.hospital
              .longitude == null
          ) {
            return false;
          }

          const distance =
            calculateDistance(
              request.hospital
                .latitude,
              request.hospital
                .longitude,
              donor.latitude,
              donor.longitude
            );

          donor._doc.distance =
            distance.toFixed(2);

          return request.radius
            ? distance <=
            Number(
              request.radius
            )
            : true;
        }
      );

    return res.json({
      totalEligible:
        eligibleDonors.length,

      hospital: {
        latitude:
          request.hospital
            .latitude,
        longitude:
          request.hospital
            .longitude,
        hospitalName:
          request.hospital
            .hospitalName,
        address:
          request.hospital.address,
      },

      donors:
        eligibleDonors,
    });
  } catch (error) {
    console.error(
      "Error fetching eligible donors:",
      error
    );

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// ========================================
// PUBLIC RESPONSE PAGE
// ========================================

const getPublicResponse = async (
  req,
  res
) => {
  try {
    const { requestId } =
      req.params;

    const request =
      await Request.findById(
        requestId
      ).populate(
        "hospital",
        "hospitalName address"
      );

    if (!request) {
      return res.status(404).json({
        message:
          "Emergency request not found.",
      });
    }

    return res.json({
      request: {
        _id: request._id,
        bloodGroup:
          request.bloodGroup,
        units:
          request.units,
        urgency:
          request.urgency,
        doctorName:
          request.doctorName,
        doctorPhone:
          request.doctorPhone,
        status:
          request.status,
        hospital:
          request.hospital,
      },
    });
  } catch (error) {
    console.error(
      "Error loading public response:",
      error
    );

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// ========================================
// PUBLIC ACCEPT / DECLINE
// ========================================

const respondToRequest = async (
  req,
  res
) => {
  try {
    const {
      requestId,
      responseId,
      action,
      latitude,
      longitude,
    } = req.body;

    if (
      !requestId ||
      !responseId ||
      !["accept", "decline"].includes(
        action
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid response details.",
      });
    }

    const request =
      await Request.findById(
        requestId
      );

    if (!request) {
      return res.status(404).json({
        message:
          "Emergency request not found.",
      });
    }

    if (
      request.status ===
      "Completed"
    ) {
      return res.status(400).json({
        message:
          "This emergency request is already completed.",
      });
    }

    const previousResponse =
      request.donorResponses?.find(
        (item) =>
          item.responseId ===
          responseId
      );

    if (previousResponse) {
      return res.status(400).json({
        message:
          "You have already responded to this request.",
      });
    }

    // DECLINE
    if (action === "decline") {
      request.donorResponses.push({
        responseId,
        status: "Declined",
        respondedAt:
          new Date(),
      });

      await request.save();

      return res.json({
        success: true,
        action: "declined",
        message:
          "Your response has been recorded. Thank you.",
      });
    }

    // ACCEPT REQUIRES LOCATION
    if (
      latitude == null ||
      longitude == null
    ) {
      return res.status(400).json({
        message:
          "Location permission is required to accept this emergency request.",
      });
    }

    if (
      request.collectedUnits >=
      request.units
    ) {
      request.status =
        "Completed";

      await request.save();

      return res.status(400).json({
        message:
          "All required blood units have already been collected.",
      });
    }

    const acceptedAt =
      new Date();

    request.collectedUnits += 1;

    request.acceptedDonors.push({
      responseId,
      acceptedAt,

      latitude:
        Number(latitude),

      longitude:
        Number(longitude),

      locationCapturedAt:
        acceptedAt,
    });

    request.donorResponses.push({
      responseId,
      status: "Accepted",
      respondedAt:
        acceptedAt,

      latitude:
        Number(latitude),

      longitude:
        Number(longitude),

      locationCapturedAt:
        acceptedAt,
    });

    if (
      request.collectedUnits >=
      request.units
    ) {
      request.status =
        "Completed";
    } else {
      request.status =
        "Accepted";
    }

    await request.save();

    const io =
      req.app.get("io");

    if (io) {
      io.emit(
        "donor-accepted",
        {
          requestId:
            request._id,

          acceptedDonor: {
            responseId,
            latitude:
              Number(latitude),
            longitude:
              Number(longitude),
            acceptedAt,
          },
        }
      );
    }

    return res.json({
      success: true,
      action: "accepted",

      message:
        "Donation accepted successfully. Your location has been shared with the hospital.",

      collectedUnits:
        request.collectedUnits,

      requiredUnits:
        request.units,

      status:
        request.status,
    });
  } catch (error) {
    console.error(
      "Error processing donor response:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Server Error",
    });
  }
};

// ========================================
// HOSPITAL ACCEPTED DONORS
// ========================================

const getAcceptedDonors = async (
  req,
  res
) => {
  try {
    const { requestId } =
      req.params;

    const request =
      await Request.findById(
        requestId
      ).populate(
        "hospital",
        "hospitalName address"
      );

    if (!request) {
      return res.status(404).json({
        message:
          "Request Not Found",
      });
    }

    if (
      req.user?.role !==
      "hospital" ||
      String(
        request.hospital?._id
      ) !==
      String(req.user.id)
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to view these donors.",
      });
    }

    return res.json({
      request: {
        _id: request._id,
        bloodGroup:
          request.bloodGroup,
        units:
          request.units,
        urgency:
          request.urgency,
        status:
          request.status,
        collectedUnits:
          request.collectedUnits,
        hospital:
          request.hospital,
      },

      acceptedDonors:
        request.acceptedDonors ||
        [],
    });
  } catch (error) {
    console.error(
      "Error fetching accepted donors:",
      error
    );

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createRequest,
  getRequests,
  acceptRequest,
  completeRequest,
  getEligibleDonors,
  getPublicResponse,
  respondToRequest,
  getAcceptedDonors,
};