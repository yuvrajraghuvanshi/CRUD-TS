import { NextRequest, NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';
import { connectToDB } from '@/lib/db';
import { signToken } from '@/lib/jwt';


export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const client = await connectToDB();
  const db = client.db();
  const user = await db.collection('users').findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
  const token = signToken({ userId: user._id.toString() });
  return NextResponse.json({ token }, { status: 200 });
}