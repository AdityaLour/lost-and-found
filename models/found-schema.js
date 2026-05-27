const mongoose = require("mongoose");
const { Schema } = mongoose;

const foundItemSchema = new Schema(
  {
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

      coordinates: {
        type: [Number],
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

foundItemSchema.index({
  location: "2dsphere",
});

module.exports = mongoose.model("FoundItem", foundItemSchema);
