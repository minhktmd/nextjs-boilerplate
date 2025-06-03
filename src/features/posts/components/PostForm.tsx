'use client';

import { useState } from 'react';
import { usePostStore } from '../store/postStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Post } from '../types';

interface PostFormProps {
  post?: Post;
  onSuccess?: () => void;
}

export const PostForm = ({ post, onSuccess }: PostFormProps) => {
  const { createPost, updatePost, useAxios, setUseAxios } = usePostStore();
  const [title, setTitle] = useState(post?.title || '');
  const [body, setBody] = useState(post?.body || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (post) {
        await updatePost(post.id, { title, body });
      } else {
        await createPost({ title, body, userId: 1 });
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm font-medium">Use Axios:</label>
        <input
          type="checkbox"
          checked={useAxios}
          onChange={(e) => setUseAxios(e.target.checked)}
          className="h-4 w-4"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="body" className="text-sm font-medium">
          Body
        </label>
        <Input
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </div>

      <Button type="submit">{post ? 'Update Post' : 'Create Post'}</Button>
    </form>
  );
}; 