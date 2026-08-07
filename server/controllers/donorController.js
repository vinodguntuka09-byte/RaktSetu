const Donor = require("../models/Donor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Donor
const registerDonor = async (req, res) => {
  try {
    

      const {
  name,
  email,
  password,
  phone,
  bloodGroup,
  age,
  weight,
  city,
  lastDonationDate,
  latitude,
  longitude,
} = req.body;

    const existingDonor = await Donor.findOne({ email });

    if (existingDonor) {
      return res.status(400).json({
        message: "Donor already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const donor = await Donor.create({
  name,
  email,
  password: hashedPassword,
  phone,
  bloodGroup,
  age,
  weight,
  city,
  latitude,
  longitude,
  lastDonationDate,
});

    res.status(201).json({
      message: "Donor Registered Successfully",
      donor: {
        _id: donor._id,
        name: donor.name,
        email: donor.email,
        phone: donor.phone,
        bloodGroup: donor.bloodGroup,
        city: donor.city,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Login Donor
const loginDonor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const donor = await Donor.findOne({ email });

    if (!donor) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    const isMatch = await bcrypt.compare(password, donor.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      {
        id: donor._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      donor: {
        _id: donor._id,
        name: donor.name,
        email: donor.email,
        phone: donor.phone,
        bloodGroup: donor.bloodGroup,
        city: donor.city,
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
  registerDonor,
  loginDonor,
};