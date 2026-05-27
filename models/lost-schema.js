const mongoose = require("mongoose");
const { Schema } = mongoose;

const lostItemSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },

      coordinates: {
        type: [Number],
        required: true,
      },

      address: {
        type: String,
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

lostItemSchema.index({
  location: "2dsphere",
});

module.exports = mongoose.model("LostItem", lostItemSchema);
