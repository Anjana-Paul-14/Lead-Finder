// app/api/user/save-place/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/connectDB';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const token = req.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;
    // const email = decoded.email;
    // const user = await User.findById(userId);
    const user = await User.findOne({ _id: userId });


    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { places } = body;


    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.savedPlaces.push(...places);
    await user.save();

    return NextResponse.json({ message: 'Places saved successfully' });
  } catch (err) {
    console.error('Save error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
