// ==================================================================
// Step 1: Import Required Modules
// ==================================================================
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/dbConnect'; // Updated relative path to connect to MongoDB
import User from '../../../models/User'; // Import User model (Mongoose)

// ==================================================================
// Step 2: API Route Handler for Getting All Users
// ==================================================================
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests for fetching all users
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }

  try {
    // Establish database connection
    await dbConnect();

    // Retrieve all users from the database, selecting _id, name, and email fields
    const users = await User.find({}, '_id name email');
    
    // Return the list of users as JSON
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Server error while retrieving users.' });
  }
}