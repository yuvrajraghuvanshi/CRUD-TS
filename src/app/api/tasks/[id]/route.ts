import { NextRequest, NextResponse } from 'next/server';

import { ObjectId } from 'mongodb';
import { verifyToken } from '@/lib/jwt';
import { connectToDB } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const decoded = verifyToken(token);
    const client = await connectToDB();
    const db = client.db();
    const task = await db.collection('tasks').findOne({ _id: new ObjectId(params.id), userId: decoded.userId });
    if (!task) return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const decoded = verifyToken(token);
    const { title, description, status } = await req.json();
    const client = await connectToDatabase();
    const db = client.db();
    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId(params.id), userId: decoded.userId },
      { $set: { title, description, status } }
    );
    if (result.matchedCount === 0) return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    return NextResponse.json({ message: 'Task updated' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const decoded = verifyToken(token);
    const client = await connectToDatabase();
    const db = client.db();
    const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(params.id), userId: decoded.userId });
    if (result.deletedCount === 0) return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    return NextResponse.json({ message: 'Task deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}