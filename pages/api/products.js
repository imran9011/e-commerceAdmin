import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Review } from "@/models/Review";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.id) {
      return res.status(200).json(await Product.findOne({ _id: req.query.id }));
    } else {
      return res.status(200).json(await Product.find({}));
    }
  }

  if (method === "POST") {
    const { title, description, price, images, selectedCateg: category, properties } = req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category: category ? category : null,
      properties,
    });
    return res.status(201).json(productDoc);
  }

  if (method === "PUT") {
    const { title, description, price, images, _id, selectedCateg: category, properties } = req.body;
    await Product.updateOne(
      { _id },
      {
        title,
        description,
        price,
        images,
        category: category ? category : null,
        properties,
      }
    );
    return res.status(200).json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.findOneAndDelete({ _id: req.query.id });
      return res.status(200).json(true);
    }
  }
}
