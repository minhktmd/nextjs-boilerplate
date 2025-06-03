'use client';

import { useEffect, useState } from 'react';
import { usePostStore } from '../store/postStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PostDetail } from './PostDetail';
import { PostForm } from './PostForm';
import { Post } from '../types';

export const PostList = () => {
  const { posts, loading, error, fetchPosts, deletePost } = usePostStore();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(id);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Posts</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Post</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <PostForm
              onSuccess={() => {
                setIsCreateDialogOpen(false);
                fetchPosts();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{post.title}</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post);
                    setIsEditDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500 line-clamp-2">{post.body}</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="mt-2">
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Post Details</DialogTitle>
                </DialogHeader>
                <PostDetail postId={post.id} />
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <PostForm
              post={selectedPost}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                fetchPosts();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 