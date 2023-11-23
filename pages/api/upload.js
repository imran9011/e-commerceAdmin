import { mongooseConnect } from "@/lib/mongoose";
import multiparty from "multiparty";
import { isAdminRequest } from "./auth/[...nextauth]";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  const form = new multiparty.Form();

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  let picLink = "";
  await cloudinary.uploader.upload(files.file[0].path, { folder: "file-upload" }).then((result) => (picLink = result.url));

  return res.status(200).json({ imageUrl: picLink });
}

export const config = {
  api: { bodyParser: false },
};
