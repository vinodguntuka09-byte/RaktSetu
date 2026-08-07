const Hospital = require("../models/Hospital");
const bcrypt = require("bcryptjs");

const registerHospital = async (req, res) => {
  try {
    const {
  hospitalName,
  licenseNumber,
  email,
  password,
  phone,
  address,
  contactPerson,
  latitude,
  longitude,
} = req.body;

    const existingHospital = await Hospital.findOne({ email });

    if (existingHospital) {
      return res.status(400).json({
        message: "Hospital already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const hospital = await Hospital.create({
  hospitalName,
  licenseNumber,
  email,
  password: hashedPassword,
  phone,
  address,
  contactPerson,
  latitude,
  longitude,
});

    res.status(201).json({
  message: "Hospital Registered Successfully",
  hospital: {
    id: hospital._id,
    hospitalName: hospital.hospitalName,
    email: hospital.email,
    licenseNumber: hospital.licenseNumber,
    phone: hospital.phone,
    address: hospital.address,
    contactPerson: hospital.contactPerson,
    verified: hospital.verified,
  },
});

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  registerHospital,
};