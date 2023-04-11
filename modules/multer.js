const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const path = require("path");
AWS.config.loadFromPath(__dirname + "/../config/s3.json");

const key = function (req, file, cb) {
  let extension = file.originalname;
  cb(null, Date.now().toString() + "." + extension);
};

const upload = multer({
  limits: { fileSize: 3 * 1024 * 1024 },
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: "nodes3newjean",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: key,
  }),
});

module.exports = upload;
