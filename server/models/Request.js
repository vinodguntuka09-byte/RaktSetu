const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },

    bloodGroup: {
      type: String,
      required: true,
    },

    units: {
      type: Number,
      required: true,
    },

    urgency: {
      type: String,
      enum: ["Critical", "Within 24 hrs", "Within a week"],
      required: true,
    },

    doctorName: {
      type: String,
      required: true,
    },

    doctorPhone: {
      type: String,
      required: true,
    },

    radius: {
      type: Number,
      required: true,
    },

    status: {
  type: String,
  enum: ["Active", "Accepted", "Completed"],
  default: "Active",
},

    acceptedDonors: [
  {
    name: String,
    phone: String,
    acceptedAt: Date,
  },
],

      collectedUnits: {
  type: Number,
  default: 0,
},

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Request", requestSchema);