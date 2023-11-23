const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  parent: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
  properties: {
    type: [Object],
  },
});

export const Category = mongoose.models?.Category || mongoose.model("Category", CategorySchema);
