const Hospital = require("../models/Hospital");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginHospital = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hospital = await Hospital.findOne({ email });

    if (!hospital) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    const isMatch = await bcrypt.compare(password, hospital.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      {
        id: hospital._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      hospital: {
        _id: hospital._id,
        hospitalName: hospital.hospitalName,
        email: hospital.email,
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
  loginHospital,
};