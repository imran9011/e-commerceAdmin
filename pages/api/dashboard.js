import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Review } from "@/models/Review";
import { User } from "@/models/User";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query.count) {
      const productCount = await Product.countDocuments();
      const reviewCount = await Review.countDocuments();
      const userCount = await User.countDocuments();
      const orderCount = await Order.countDocuments();
      return res.status(200).json({ productCount, reviewCount, userCount, orderCount });
    }
  }
}
