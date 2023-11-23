const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    line_items: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    town: {
      type: String,
      required: true,
    },
    postCode: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    paid: Boolean,
    total: Number,
  },
  { timestamps: true }
);

export const Order = mongoose.models?.Order || mongoose.model("Order", OrderSchema);
