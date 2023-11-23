import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { isAdminRequest } from "./auth/[...nextauth].js";

export default async function handler(req, res) {
  await mongooseConnect();
  const { method } = req;
  await isAdminRequest(req, res);
  const limit = 10;

  if (method === "GET") {
    // dashboard
    if (req.query.dashboard) {
      const year = new Date().getFullYear();
      return res.status(200).json(
        await Order.find({
          createdAt: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year + 1, 0, 1),
          },
        })
          .select({ total: 1, createdAt: 1 })
          .sort({ createdAt: 1 })
      );
    }
    // orders page onMount
    const orderCount = await Order.find({}).countDocuments();
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(limit);
    return res.status(200).json({ orders, orderCount });
  }
  if (method === "POST") {
    const { email, fromDate, toDate, page, id } = req.body;

    //  order/:id page to show a single order
    if (id) {
      const order = await Order.findById(id);
      return res.status(200).json(order);
    }
    // orders page on filter or page change
    let newToDate = new Date(toDate);
    newToDate = newToDate.setHours(23, 59, 59);
    let filter = {};
    if (email) {
      filter.email = email;
    }
    if (fromDate && toDate) {
      filter.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(newToDate),
      };
    }
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit);

    const orderCount = await Order.find(filter).sort({ createdAt: -1 }).countDocuments();

    return res.status(200).json({ orders, orderCount });
  }
}
