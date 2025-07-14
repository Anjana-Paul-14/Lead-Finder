import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { Place } from '@/types/place';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Get JWT token from cookies
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    // Find user and return saved places
    const user = await User.findOne({ _id: userId }, 'savedPlaces');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // return NextResponse.json({ savedPlaces: user.savedPlaces });
    return NextResponse.json({ savedPlaces: user.savedPlaces as Place[] });
  } catch (err) {
    console.error('Fetch error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}