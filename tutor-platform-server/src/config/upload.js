const multer = require("multer");
const path = require("path");
const fs = require("fs");

const receiptsDir = path.join(__dirname, "..", "uploads", "receipts");

if (!fs.existsSync(receiptsDir)) {
  fs.mkdirSync(receiptsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, receiptsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const fileName = `receipt_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, fileName);
  },
});

function fileFilter(req, file, cb) {
  const allowed =
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf";

  if (!allowed) {
    return cb(new Error("Only image or PDF files are allowed"));
  }

  cb(null, true);
}

const uploadReceipt = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = { uploadReceipt };