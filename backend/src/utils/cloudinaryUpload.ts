import cloudinary from "../config/cloudinary.js";
export function uploadToCloudinary(
  file: Express.Multer.File
): Promise<{ url: string; name: string; type: "image" | "file" | "audio" }> {
  return new Promise((resolve, reject) => {
    let resourceType: "image" | "video" | "raw" | "auto" = "auto";
    let fileType: "image" | "file" | "audio" = "file";

    const mimeType = file.mimetype.toLowerCase();

    if (mimeType.startsWith("image/")) {
      resourceType = "image";
      fileType = "image";
    } else if (mimeType.startsWith("audio/")) {
      resourceType = "video"; // Cloudinary uses "video" resource type for audio
      fileType = "audio";
    } else if (mimeType === "application/pdf") {
      resourceType = "image"; // PDF as image for preview generation
      fileType = "file";
    } else {
      resourceType = "raw"; // Other documents
      fileType = "file";
    }

    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: "chat-attachments" },
      (error, result) => {
        if (error) {
          console.error("[uploadToCloudinary] Error:", error);
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Upload failed - no result returned"));
        }

        resolve({
          url: result.secure_url,
          name: file.originalname,
          type: fileType,
        });
      }
    );
    stream.end(file.buffer);
  });
}
