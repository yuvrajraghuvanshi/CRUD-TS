import { connectToDB } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const decoded = verifyToken(token);
    const client = await connectToDB();
    const db = client.db();
    const tasks = await db.collection('tasks').find({ userId: decoded.userId }).toArray();
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const decoded = verifyToken(token);
    const { title, description, status } = await req.json();
    if (!title) return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    const client = await connectToDatabase();
    const db = client.db();
    const task = { title, description, status: status || 'pending', userId: decoded.userId };
    const result = await db.collection('tasks').insertOne(task);
    return NextResponse.json({ message: 'Task created', taskId: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}