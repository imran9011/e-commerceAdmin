import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth].js";
import { Review } from "@/models/Review.js";
import { User } from "@/models/User.js";
// needed for delete as review references product
import { Product } from "@/models/Product.js";

export default async function handler(req, res) {
  await mongooseConnect();
  const { method } = req;
  await isAdminRequest(req, res);
  const limit = 10;

  if (method === "GET") {
    // reviews page onMount
    const reviewCount = await Review.find({}).countDocuments();
    const reviews = await Review.find({}).populate("user", "email").sort({ createdAt: -1 }).limit(limit);
    return res.status(200).json({ reviews, reviewCount });
  }

  if (method === "DELETE") {
    const { id } = req.body;
    await Review.findByIdAndDelete(id);
    return res.status(200).json();
  }

  if (method === "POST") {
    const { email, fromDate, toDate, page, id } = req.body;

    //  review/:id page to show a single review
    if (id) {
      const review = await Review.findById(id).populate("user", "email");
      return res.status(200).json(review);
    }
    // reviews page on filter or page change
    let newToDate = new Date(toDate);
    newToDate = newToDate.setHours(23, 59, 59);
    let filter = {};
    if (email) {
      const user = await User.findOne({ email }, "_id");
      if (user) {
        filter.user = user?._id;
      } else {
        return res.status(200).json({ reviews: [], reviewCount: 0 });
      }
    }
    if (fromDate && toDate) {
      filter.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(newToDate),
      };
    }
    const reviews = await Review.find(filter)
      .populate("user", "email")
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit);
    const reviewCount = await Review.find(filter).sort({ createdAt: -1 }).countDocuments();

    return res.status(200).json({ reviews, reviewCount });
  }
}
