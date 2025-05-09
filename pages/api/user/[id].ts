// ==================================================================
// Step 1: Import Required Modules
// ==================================================================
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect'; // ✅ Ensure correct path for dbConnect
import User from '@/models/User'; // ✅ Ensure correct path for User model
import mongoose from 'mongoose'; // ✅ Import Mongoose for ObjectId validation

// ==================================================================
// Step 2: API Route Handler for Deleting a User
// ==================================================================
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ✅ Establish database connection
  await dbConnect();

  // ✅ Retrieve HTTP method and user ID from request query
  const { method, query: { id } } = req;

  // ✅ Validate ObjectId format before querying MongoDB
  if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({ error: 'Invalid user ID format.' });
  }

  try {
    switch (method) {
      case 'DELETE':
        // ✅ Find and delete user by ID
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
          return res.status(404).json({ error: 'User not found.' });
        }

        return res.status(200).json({
          message: 'User deleted successfully.',
          user: deletedUser,
        });

      default:
        // ✅ Restrict the route to DELETE method only
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).json({ error: `Method ${method} not allowed.` });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Server error while deleting user.' });
  }
}