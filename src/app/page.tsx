'use client';

import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '../lib/fetcher';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { data, error } = useSWR('/api/tasks', fetcher);

  useEffect(()=>{
  if (!localStorage.getItem('token')) {
    router.push('/login');
    return null;
  }
},[router])

  if (error) return <div>Failed to load tasks</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <button
        onClick={() => router.push('/tasks/new')}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Task
      </button>
      <div>
        {data.tasks.map((task: any) => (
          <div key={task._id} className="border p-4 mb-2 rounded">
            <h2 className="text-xl">{task.title}</h2>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <button
              onClick={() => router.push(`/tasks/${task._id}`)}
              className="text-blue-500 mr-2"
            >
              Edit
            </button>
            <button
              onClick={async () => {
                await fetch(`/api/tasks/${task._id}`, {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                router.refresh();
              }}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}