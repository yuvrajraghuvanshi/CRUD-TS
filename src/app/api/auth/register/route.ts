import { NextRequest, NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';
import { connectToDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }
  const client = await connectToDB();
  const db = client.db();
  const existingUser = await db.collection('users').findOne({ username });
  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 409 });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.collection('users').insertOne({ username, password: hashedPassword });
  return NextResponse.json({ message: 'User registered', userId: result.insertedId }, { status: 201 });
}