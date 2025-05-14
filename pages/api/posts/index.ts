// pages/api/posts/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import getRawBody from "raw-body";

// Disable Next.js's default body parsing to allow us to handle both JSON and multipart requests.
export const config = {
  api: {
    bodyParser: false,
  },
};

// In-memory store for posts (for demonstration only)
let postsData: any[] = [];

// Helper function: Wrap formidable.parse in a Promise.
const parseForm = (req: NextApiRequest): Promise<{
  fields: formidable.Fields;
  files: formidable.Files;
}> => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      resolve({ fields, files });
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle GET: Return all posts from the in-memory store.
  if (req.method === "GET") {
    // Prevent caching so that you always see the latest posts.
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ posts: postsData });
  }

  // Handle POST: Create a new post.
  if (req.method === "POST") {
    try {
      const contentType = req.headers["content-type"] || "";
      let newPost: any = {};

      if (contentType.includes("multipart/form-data")) {
        // Parse multipart/form-data using formidable.
        const { fields, files } = await parseForm(req);
        console.log("Parsed fields:", fields);
        console.log("Parsed files:", files);
        // Construct a new post from the parsed data.
        newPost = {
          ...fields,
          media: files.media,
          createdAt: new Date().toISOString(),
        };
      } else if (contentType.includes("application/json")) {
        // Read and parse the raw JSON body.
        const rawBody = await getRawBody(req, {
          length: req.headers["content-length"],
          encoding: "utf8",
        });
        const data = JSON.parse(rawBody);
        console.log("Received JSON data:", data);
        newPost = { ...data, createdAt: new Date().toISOString() };
      } else {
        return res
          .status(400)
          .json({ message: "Unsupported content type." });
      }

      // Validate required fields.
      if (
        !newPost.title ||
        !newPost.content ||
        !newPost.platform ||
        !newPost.scheduledAt
      ) {
        return res
          .status(400)
          .json({ message: "Title, content, platform and scheduled time are required." });
      }

      // Assign a unique _id if not provided. (Use timestamp for demo.)
      newPost._id = new Date().getTime().toString();

      // Add the new post to the in-memory store.
      postsData.push(newPost);
      console.log("Current postsData:", postsData);

      return res.status(201).json({
        message: "Post created successfully",
        post: newPost,
      });
    } catch (error: any) {
      console.error("Server error in POST /api/posts:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }
}