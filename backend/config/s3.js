import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
	credentials: {
		secretAccessKey:process.env.SECRET_ACCESS_KEY ,
		accessKeyId: process.env.ACCESS_KEY
	},
	region: process.env.REGION
});

const upload = multer({
	
	storage: multerS3({
		s3: s3,
		bucket: process.env.BUCKET_NAME,
		contentType: multerS3.AUTO_CONTENT_TYPE,
		metadata: function (req, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function (req, file, cb) {
			cb(null, `yolo${Date.now().toString()}`);
		}
	})
});

export { upload };