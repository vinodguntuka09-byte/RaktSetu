const Request = require("../models/Request");
const Donor = require("../models/Donor");
const sendEmail = require("../utils/sendEmail");
const calculateDistance = require("../utils/calculateDistance");
const compatibility = require("../utils/bloodCompatibility");


const createRequest = async (req, res) => {
  try {
    const {
      hospital,
      bloodGroup,
      units,
      urgency,
      doctorName,
      doctorPhone,
      radius,
    } = req.body;

    const request = await Request.create({
      hospital,
      bloodGroup,
      units,
      urgency,
      doctorName,
      doctorPhone,
      radius,
    });

      const hospitalData = await request.populate("hospital");

     const today = new Date();

const ninetyDaysAgo = new Date();
ninetyDaysAgo.setDate(today.getDate() - 90);

const donors = await Donor.find({
  bloodGroup: {
  $in: compatibility[bloodGroup],
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
  if (!donor.lastDonationDate) return true;

  return donor.lastDonationDate <= ninetyDaysAgo;
});

for (const donor of eligibleDonors) {

  const distance = calculateDistance(
    hospitalData.hospital.latitude,
    hospitalData.hospital.longitude,
    donor.latitude,
    donor.longitude
  );

  const mapLink = `https://www.google.com/maps/dir/${donor.latitude},${donor.longitude}/${hospitalData.hospital.latitude},${hospitalData.hospital.longitude}`;

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
${units}

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
}

const io = req.app.get("io");

io.emit("new-request", {
  hospital,
  bloodGroup,
  units,
  urgency,
  doctorName,
  doctorPhone,
  radius,
});

     res.status(201).json({
  message: `Blood Request Created Successfully. ${eligibleDonors.length} eligible donor(s) found.`,
  request,
});   



  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("hospital", "hospitalName")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.log(error);

    res.status(500).json({
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

    const alreadyAccepted = request.acceptedDonors.find(
  (donor) => donor.phone === donorPhone
);

if (alreadyAccepted) {
  return res.status(400).json({
    message: "You have already accepted this request.",
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

    res.json({
      message: "Donation Accepted Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
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

    res.json({
      message: "Request Completed Successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


const getEligibleDonors = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId)
  .populate("hospital");

      console.log("========== REQUEST ==========");
console.log(request);
console.log("=============================");


    if (!request) {
      return res.status(404).json({
        message: "Request Not Found",
      });
    }

    const today = new Date();

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(today.getDate() - 90);

    const donors = await Donor.find({
      bloodGroup: {
  $in: compatibility[request.bloodGroup],
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
  // Last Donation Check
  if (
    donor.lastDonationDate &&
    donor.lastDonationDate > ninetyDaysAgo
  ) 


  // GPS Check
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

  console.log(
  donor.name,
  "->",
  donor._doc.distance,
  "KM"
);

  return distance <= request.radius;


});

    res.json({
  totalEligible: eligibleDonors.length,
  hospital: {
    latitude: request.hospital.latitude,
    longitude: request.hospital.longitude,
    hospitalName: request.hospital.hospitalName,
  },
  donors: eligibleDonors,
});

  } catch (error) {
    console.log(error);

    res.status(500).json({
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