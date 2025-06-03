'use client';

import { useEffect } from 'react';
import { usePostStore } from '../store/postStore';

interface PostDetailProps {
  postId: number;
}

export const PostDetail = ({ postId }: PostDetailProps) => {
  const { selectedPost, loading, error, fetchPostWithComments } = usePostStore();

  useEffect(() => {
    fetchPostWithComments(postId);
  }, [postId, fetchPostWithComments]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!selectedPost) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{selectedPost.title}</h3>
        <p className="text-gray-600">{selectedPost.body}</p>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Comments</h4>
        <div className="space-y-4">
          {selectedPost.comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{comment.name}</span>
                <span className="text-sm text-gray-500">({comment.email})</span>
              </div>
              <p className="text-gray-600">{comment.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 