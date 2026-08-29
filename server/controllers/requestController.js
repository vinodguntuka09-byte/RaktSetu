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
        message: "Please provide all required blood request details.",
      });
    }

    const compatibleGroups = compatibility[bloodGroup] || [bloodGroup];

    const request = await Request.create({
      hospital,
      bloodGroup,
      units: numericUnits,
      urgency,
      doctorName,
      doctorPhone,
      radius: numericRadius,
    });

    const hospitalData = await request.populate("hospital");

    if (!hospitalData.hospital) {
      return res.status(404).json({
        message: "Hospital not found.",
      });
    }

    const today = new Date();

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(today.getDate() - 90);

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

    const eligibleDonors = donors.filter((donor) => {
      if (
        donor.lastDonationDate &&
        donor.lastDonationDate > ninetyDaysAgo
      ) {
        return false;
      }

      if (
        donor.latitude == null ||
        donor.longitude == null ||
        hospitalData.hospital.latitude == null ||
        hospitalData.hospital.longitude == null
      ) {
        return false;
      }

      const distance = calculateDistance(
        hospitalData.hospital.latitude,
        hospitalData.hospital.longitude,
        donor.latitude,
        donor.longitude
      );

      return distance <= numericRadius;
    });

    for (const donor of eligibleDonors) {
      const distance = calculateDistance(
        hospitalData.hospital.latitude,
        hospitalData.hospital.longitude,
        donor.latitude,
        donor.longitude
      );

      const mapLink = `https://www.google.com/maps/dir/${donor.latitude},${donor.longitude}/${hospitalData.hospital.latitude},${hospitalData.hospital.longitude}`;

      // EMAIL
      try {
        await sendEmail(
          donor.email,
          "🚨 Emergency Blood Request - RaktSetu",
          `Hello ${donor.name},

A nearby hospital urgently needs blood.

━━━━━━━━━━━━━━━━━━━━━━

🏥 Hospital
${hospitalData.hospital.hospitalName}

📍 Address
${hospitalData.hospital.address}

📏 Distance From You
${distance.toFixed(2)} KM

🗺️ Google Maps
${mapLink}

━━━━━━━━━━━━━━━━━━━━━━

🩸 Blood Group
${bloodGroup}

🩸 Units Required
${numericUnits}

⚠️ Urgency
${urgency}

━━━━━━━━━━━━━━━━━━━━━━

👨‍⚕️ Doctor
${doctorName}

📞 Contact
${doctorPhone}

━━━━━━━━━━━━━━━━━━━━━━

Please login to RaktSetu immediately if you are willing to donate.

Thank you ❤️

— Team RaktSetu`
        );
      } catch (emailError) {
        console.warn(
          `Failed to send email to ${donor.email}:`,
          emailError.message
        );
      }

      // SMS
      try {
        await sendSMS(donor.phone);
      } catch (smsError) {
        console.warn(
          `Failed to send SMS to donor:`,
          smsError.message
        );
      }
    }

    // REAL-TIME SOCKET EVENT
    const io = req.app.get("io");

    if (io) {
      io.emit("new-request", {
        hospital,
        hospitalName: hospitalData.hospital.hospitalName,
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
    console.error("Error creating request:", error);

    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

const getRequests = async (req, res) => {
  try {
    let requests;

    // Hospital: only show requests created by the logged-in hospital
    if (req.user?.role === "hospital") {
      requests = await Request.find({
        hospital: req.user.id,
      })
        .populate("hospital", "hospitalName")
        .sort({ createdAt: -1 });
    } else {
      // Donor: keep existing behavior
      requests = await Request.find()
        .populate("hospital", "hospitalName")
        .sort({ createdAt: -1 });
    }

    return res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const { requestId, donorName, donorPhone } = req.body;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Request Not Found",
      });
    }

    if (request.status === "Completed") {
      return res.status(400).json({
        message: "This blood request is already completed.",
      });
    }

    const alreadyAccepted = request.acceptedDonors.find(
      (donor) => donor.phone === donorPhone
    );

    if (alreadyAccepted) {
      return res.status(400).json({
        message: "You have already accepted this request.",
      });
    }

    if (request.collectedUnits >= request.units) {
      request.status = "Completed";

      await request.save();

      return res.status(400).json({
        message: "All required blood units have already been collected.",
      });
    }

    request.collectedUnits += 1;

    request.acceptedDonors.push({
      name: donorName,
      phone: donorPhone,
      acceptedAt: new Date(),
    });

    if (request.collectedUnits >= request.units) {
      request.status = "Completed";
    } else {
      request.status = "Accepted";
    }

    await request.save();

    return res.json({
      message: "Donation Accepted Successfully",
      collectedUnits: request.collectedUnits,
      requiredUnits: request.units,
      status: request.status,
    });
  } catch (error) {
    console.error("Error accepting request:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const completeRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Request Not Found",
      });
    }

    request.status = "Completed";

    await request.save();

    return res.json({
      message: "Request Completed Successfully",
    });
  } catch (error) {
    console.error("Error completing request:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const getEligibleDonors = async (req, res) => {
  try {
    const request = await Request.findById(
      req.params.requestId
    ).populate("hospital");

    if (!request) {
      return res.status(404).json({
        message: "Request Not Found",
      });
    }

    if (!request.hospital) {
      return res.status(404).json({
        message: "Hospital information not found for this request.",
      });
    }

    const bloodGroup = request.bloodGroup
      ? request.bloodGroup.trim().toUpperCase()
      : "";

    const compatibleGroups =
      compatibility[bloodGroup] || [bloodGroup];

    const today = new Date();

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(today.getDate() - 90);

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

    const eligibleDonors = donors.filter((donor) => {
      if (
        donor.lastDonationDate &&
        donor.lastDonationDate > ninetyDaysAgo
      ) {
        return false;
      }

      if (
        donor.latitude == null ||
        donor.longitude == null ||
        request.hospital.latitude == null ||
        request.hospital.longitude == null
      ) {
        return false;
      }

      const distance = calculateDistance(
        request.hospital.latitude,
        request.hospital.longitude,
        donor.latitude,
        donor.longitude
      );

      donor._doc.distance = distance.toFixed(2);

      return request.radius
        ? distance <= Number(request.radius)
        : true;
    });

    return res.json({
      totalEligible: eligibleDonors.length,
      hospital: {
        latitude: request.hospital.latitude,
        longitude: request.hospital.longitude,
        hospitalName: request.hospital.hospitalName,
        address: request.hospital.address,
      },
      donors: eligibleDonors,
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

module.exports = {
  createRequest,
  getRequests,
  acceptRequest,
  completeRequest,
  getEligibleDonors,
};