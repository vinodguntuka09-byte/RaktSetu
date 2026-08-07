const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    hospitalName: {
      type: String,
      required: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

        latitude: {
  type: Number,
  default: null,
},

longitude: {
  type: Number,
  default: null,
},


    contactPerson: {
      type: String,
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hospital", hospitalSchema);