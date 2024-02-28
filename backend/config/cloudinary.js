import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
const apiKey=parseInt(process.env.API_KEY)
cloudinary.config({
    cloud_name: "viewfindermern",
    api_key:apiKey,
    api_secret: process.env.API_SECRET
});


export default cloudinary;