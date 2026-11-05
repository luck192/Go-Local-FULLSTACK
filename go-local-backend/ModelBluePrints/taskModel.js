const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    address: { type: String, default: "", trim: true },

    // dummy amount jo rider ko milega
    price: { type: Number, required: true },

    // open -> in_progress -> completed
    status: {
      type: String,
      enum: ["open", "in_progress", "completed"],
      default: "open",
    },

    createdBy: { type: String, required: true }, // user ki id
    createdByName: { type: String, default: "" },

    acceptedBy: { type: String, default: null }, // rider ki id

    riderPhoneNo:
    {type: String,
    default : null},

    acceptedByName: { type: String, default: "" },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);