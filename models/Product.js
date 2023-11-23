const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide product name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide product desription"],
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      default: 0,
    },
    images: {
      type: [String],
      required: [true, "Please provide image"],
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    properties: {
      type: Object,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

ProductSchema.statics.deleteReviews = async function (productId) {
  try {
    await this.model("Review").deleteMany({ product: productId });
  } catch (error) {
    console.log(error);
  }
};

ProductSchema.post("findOneAndDelete", async function (doc) {
  const Model = mongoose.model("Product");
  await Model.deleteReviews(doc?._id);
});

export const Product = mongoose.models?.Product || mongoose.model("Product", ProductSchema);
