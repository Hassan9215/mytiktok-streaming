require("dotenv").config();
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

// Load credentials & region from .env
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_DIR = process.env.S3_DIR || "";
const REGION = process.env.AWS_REGION;

// Configure AWS
AWS.config.update({ region: REGION });
const s3 = new AWS.S3();

// Get files from command-line args
const files = process.argv.slice(2);

if (files.length === 0) {
  console.error("❌ No video files provided.\nUsage: node index.js video1.mp4 video2.mp4");
  process.exit(1);
}

async function uploadFile(file) {
  try {
    const fileStream = fs.createReadStream(file);
    const contentType = mime.lookup(file) || "application/octet-stream";

    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: path.posix.join(S3_DIR, path.basename(file)),
      Body: fileStream,
      ContentType: contentType
    };

    const result = await s3.upload(params).promise();
    console.log(`✅ Uploaded: ${file} → ${result.Location}`);
  } catch (err) {
    console.error(`❌ Failed to upload ${file}:`, err.message);
  }
}

(async () => {
  for (const file of files) {
    await uploadFile(file);
  }
  console.log("✅ All uploads complete.");
})();

