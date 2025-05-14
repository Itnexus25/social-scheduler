import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import getRawBody from "raw-body";
import dbConnect from "../../../lib/dbConnect";
import Post from "../../../models/Post";
import { cloudinary } from "../../../lib/cloudinary"; // Import Cloudinary config

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parsing to support multipart/form-data.
  },
};

// Helper function for parsing multipart/form-data.
async function parseForm(req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

// Helper function that extracts a string value. If the field is an array, returns its first element.
function extractField(field: any): string {
  if (Array.isArray(field)) {
    return field[0] || "";
  }
  return field || "";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure we’re connected to MongoDB.
  await dbConnect();

  if (req.method === "GET") {
    // GET: Fetch posts from the database.
    res.setHeader("Cache-Control", "no-store");
    try {
      const posts = await Post.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ posts });
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      return res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const contentType = req.headers["content-type"] || "";
      let newPostData: any = {};

      // Handle multipart/form-data requests.
      if (contentType.includes("multipart/form-data")) {
        const { fields, files } = await parseForm(req);
        console.log("Parsed fields:", fields);
        console.log("Parsed files:", files);
        newPostData = { ...fields };

        // Process the media file if one was uploaded.
        if (files.media) {
          // Ensure mediaFile is an object and not an array.
          const mediaFile = Array.isArray(files.media) ? files.media[0] : files.media;

          if (!mediaFile || !mediaFile.filepath) {
            throw new Error("Uploaded file is missing or has no valid filepath.");
          }

          try {
            // Upload to Cloudinary.
            const cloudinaryResult = await cloudinary.uploader.upload(mediaFile.filepath, {
              folder: "social_scheduler", // Optional folder name in Cloudinary.
            });

            // Store the Cloudinary URL in the database.
            newPostData.media = cloudinaryResult.secure_url;
          } catch (uploadError) {
            console.error("Cloudinary upload failed:", uploadError);
            return res.status(500).json({ message: "Failed to upload media to Cloudinary.", error: uploadError });
          }
        }
      }
      // Handle application/json requests.
      else if (contentType.includes("application/json")) {
        const rawBody = await getRawBody(req, {
          length: req.headers["content-length"],
          encoding: "utf8",
        });
        const data = JSON.parse(rawBody);
        console.log("Received JSON data:", data);
        newPostData = { ...data };
      } else {
        return res.status(400).json({ message: "Unsupported content type." });
      }

      // Extract required fields.
      const title = extractField(newPostData.title);
      const content = extractField(newPostData.content);
      const platform = extractField(newPostData.platform);
      const scheduledAt = extractField(newPostData.scheduledAt);

      // Get the authenticated user info from the x-user header.
      const userHeader = req.headers["x-user"];
      let userId = "";
      if (userHeader) {
        try {
          const parsedUser = JSON.parse(userHeader as string);
          userId = parsedUser.id;
        } catch (err) {
          console.error("Error parsing x-user header:", err);
        }
      }
      if (!userId) {
        return res.status(401).json({ message: "User authentication required." });
      }

      // Validate required fields.
      if (!title || !content || !platform || !scheduledAt) {
        return res.status(400).json({
          message: "Title, content, platform, and scheduledAt are required.",
        });
      }

      // Normalize platform and validate against allowed values.
      const normalizedPlatform = platform.toLowerCase();
      const allowedPlatforms = ["facebook", "instagram", "youtube", "tiktok"];
      if (!allowedPlatforms.includes(normalizedPlatform)) {
        return res.status(400).json({
          message: `Invalid platform. Allowed platforms are: ${allowedPlatforms.join(", ")}`,
        });
      }

      // Create the new post.
      const newPost = await Post.create({
        title,
        content,
        platform: normalizedPlatform,
        scheduledAt: new Date(scheduledAt),
        user: userId, // Store the authenticated user's ID.
        media: newPostData.media || "", // Store the Cloudinary URL, or empty string if not provided.
      });

      console.log("New post created:", newPost);
      return res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error: any) {
      console.error("Error creating post:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}