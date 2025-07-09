import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/connectDB';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { places } = body;

    const updatedUser = await User.findOneAndUpdate(
      { email: token.email },
      { $set: { savedPlaces: places } },
      { new: true }
    );

    return NextResponse.json({ success: true, savedPlaces: updatedUser.savedPlaces });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
