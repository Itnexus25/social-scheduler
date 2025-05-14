// pages/api/users/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect'; // Adjust the path as needed
import User from '@/models/User'; // Adjust the path as needed
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Establish database connection.
  await dbConnect();

  // Retrieve HTTP method and user ID from request query.
  const { method, query: { id } } = req;

  // Normalize the id to ensure it's a string.
  const userId = Array.isArray(id) ? id[0] : id;

  // Validate ObjectId format before querying MongoDB.
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format.' });
  }

  try {
    switch (method) {
      case 'DELETE': {
        // Find and delete user by ID.
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
          return res.status(404).json({ error: 'User not found.' });
        }
        return res.status(200).json({
          message: 'User deleted successfully.',
          user: deletedUser,
        });
      }
      default:
        // Restrict the route to DELETE method only.
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).json({ error: `Method ${method} not allowed.` });
    }
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Server error while deleting user.' });
  }
}