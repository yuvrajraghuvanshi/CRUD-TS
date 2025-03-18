'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

type FormData = { username: string; password: string };

export default function Login() {
  const { register, handleSubmit } = useForm<FormData>();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    console.log({res})
    const result = await res.json();
    if (res.ok) {
      localStorage.setItem('token', result.token);
      router.push('/');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block">Username</label>
          <input {...register('username')} className="border p-2 w-full" required />
        </div>
        <div>
          <label className="block">Password</label>
          <input
            type="password"
            {...register('password')}
            className="border p-2 w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}