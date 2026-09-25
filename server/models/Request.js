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
        responseId: {
          type: String,
          required: true,
        },

        // Kept for compatibility with the existing donor-dashboard flow
        donor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Donor",
        },

        name: String,
        phone: String,
        bloodGroup: String,

        acceptedAt: {
          type: Date,
          default: Date.now,
        },

        latitude: Number,
        longitude: Number,

        locationCapturedAt: Date,
      },
    ],

    donorResponses: [
      {
        responseId: {
          type: String,
          required: true,
        },

        status: {
          type: String,
          enum: ["Accepted", "Declined"],
          required: true,
        },

        respondedAt: {
          type: Date,
          default: Date.now,
        },

        latitude: Number,
        longitude: Number,

        locationCapturedAt: Date,
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