const mongoose = require("mongoose");
const validator = require("validator");

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide email"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
    },
  },
  { timestamps: true }
);

export const Admin = mongoose.models?.Admin || mongoose.model("Admin", AdminSchema);
