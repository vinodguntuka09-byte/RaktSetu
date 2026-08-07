const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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

    bloodGroup: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    city: {
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

    lastDonationDate: {
      type: Date,
      default: null,
    },

    consent: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Donor", donorSchema);