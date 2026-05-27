const mongoose = require("mongoose");
const { Schema } = mongoose;

const lostItemSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: {
      address: {
        type: String,

        required: true,
      },

      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },

      source: {
        type: String,
        required: true,
      },
    },

    description: {
      category: {
        type: String,
        required: true,
      },

      details: {
        type: String,
        required: true,
      },

      lostDate: {
        type: Date,
        required: true,
      },
    },

    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("LostItem", lostItemSchema);
