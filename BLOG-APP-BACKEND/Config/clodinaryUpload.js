import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "blog_users" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// Cloudinary doesn't support promises natively, so we use callbacks.
// We wrap the callback in a promise so we can consume it with async/await.
// This technique is called "promisification".
