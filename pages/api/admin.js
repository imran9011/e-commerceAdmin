import { mongooseConnect } from "@/lib/mongoose";
import { Admin } from "@/models/Admin";
import { authOptions, isAdminRequest } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "POST") {
    const { email } = req.body;
    const session = await getServerSession(req, res, authOptions);
    if (!email || email === session.email) {
      return res.status(400).json({ err: "invalid email" });
    }
    await Admin.create({ email });
    return res.status(201).json();
  }

  if (method === "DELETE") {
    const { email } = req.body;
    const session = await getServerSession(req, res, authOptions);
    if (!email || email === session.email || email === "test@mail.com") {
      return res.status(400).json({ err: "invalid email" });
    }
    await Admin.findOneAndDelete({ email });
    return res.status(200).json();
  }

  if (method === "GET") {
    const admins = await Admin.find();
    return res.status(200).json(admins);
  }
}
