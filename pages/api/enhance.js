import formidable from "formidable";
import sharp from "sharp";

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
      const form = formidable({ multiples: false });
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
    if (!filepath) {
      return res.status(400).json({ error: "invalid_upload" });
    }

    const enhanced = await sharp(filepath, { failOn: false })
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
    return res.status(500).json({ error: "enhancement_failed", detail: err?.message || "unknown_error" });
  }
}
