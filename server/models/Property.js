import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    rent: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    dueDate: {
  type: Number,
  min: 1,
  max: 31,
  default: null,
},

    status: {
      type: String,
      enum: ["available", "rented"],
      default: "available",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Property", propertySchema);
