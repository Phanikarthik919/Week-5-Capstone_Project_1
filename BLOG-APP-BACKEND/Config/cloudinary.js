// import { v2 as cloudinary } from "cloudinary";
const cloudinary = {
  config: () => {},
  uploader: {
    upload_stream: () => ({ end: () => {} }),
    destroy: () => Promise.resolve()
  }
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default cloudinary;