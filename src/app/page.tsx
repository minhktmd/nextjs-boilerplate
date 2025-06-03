import { PostList } from '@/features/posts';

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Next.js Boilerplate</h1>
      <PostList />
    </main>
  );
}
