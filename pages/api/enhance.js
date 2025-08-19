import formidable from "formidable";
import sharp from "sharp";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { files } = await new Promise((resolve, reject) => {
      const form = formidable({ multiples: false, keepExtensions: true });
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const file = files.image;
    if (!file) {
      return res.status(400).json({ error: "no_file_uploaded" });
    }

    const f = Array.isArray(file) ? file[0] : file;
    const filepath = f.filepath || f.path;

    // ✅ Read the uploaded file into a buffer (instead of relying on path alone)
    const buffer = await fs.readFile(filepath);

    // Process with Sharp
    const enhanced = await sharp(buffer, { failOn: false })
      .rotate()
      .normalize()
      .gamma(1.05)
      .modulate({ brightness: 1.10, saturation: 1.05 })
      .linear(1.04, -8)
      .sharpen()
      .jpeg({ quality: 90, chromaSubsampling: "4:4:4" })
      .toBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Content-Disposition", "attachment; filename=enhanced.jpg");
    return res.status(200).send(enhanced);
  } catch (err) {
    console.error("Enhance error", err);
    return res
      .status(500)
      .json({ error: "enhancement_failed", detail: err.message || "unknown_error" });
  }
}
