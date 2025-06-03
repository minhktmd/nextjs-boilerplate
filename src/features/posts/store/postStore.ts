'use client';

import { create } from 'zustand';
import { Post, PostWithComments } from '../types';
import { postService } from '../services/postService';
import { postServiceAxios } from '../services/postServiceAxios';

interface PostState {
  posts: Post[];
  selectedPost: PostWithComments | null;
  loading: boolean;
  error: string | null;
  useAxios: boolean;
  setUseAxios: (useAxios: boolean) => void;
  fetchPosts: () => Promise<void>;
  fetchPostWithComments: (postId: number) => Promise<void>;
  createPost: (post: Omit<Post, 'id'>) => Promise<void>;
  updatePost: (id: number, post: Partial<Post>) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  selectedPost: null,
  loading: false,
  error: null,
  useAxios: false,

  setUseAxios: (useAxios: boolean) => set({ useAxios }),

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const { useAxios } = get();
      const posts = useAxios
        ? await postServiceAxios.getPosts()
        : await postService.getPosts();
      set({ posts, loading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch posts';
      set({ error: errorMessage, loading: false });
    }
  },

  fetchPostWithComments: async (postId: number) => {
    set({ loading: true, error: null });
    try {
      const { useAxios } = get();
      const [post, comments] = useAxios
        ? await Promise.all([
            postServiceAxios.getPostById(postId),
            postServiceAxios.getCommentsByPostId(postId),
          ])
        : await Promise.all([
            postService.getPostById(postId),
            postService.getCommentsByPostId(postId),
          ]);
      set({
        selectedPost: { ...post, comments },
        loading: false,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch post details';
      set({ error: errorMessage, loading: false });
    }
  },

  createPost: async (post: Omit<Post, 'id'>) => {
    set({ loading: true, error: null });
    try {
      const { useAxios } = get();
      const newPost = useAxios
        ? await postServiceAxios.createPost(post)
        : await postService.createPost(post);
      set((state) => ({
        posts: [...state.posts, newPost],
        loading: false,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
      set({ error: errorMessage, loading: false });
    }
  },

  updatePost: async (id: number, post: Partial<Post>) => {
    set({ loading: true, error: null });
    try {
      const { useAxios } = get();
      const updatedPost = useAxios
        ? await postServiceAxios.updatePost(id, post)
        : await postService.updatePost(id, post);
      set((state) => ({
        posts: state.posts.map((p) => (p.id === id ? updatedPost : p)),
        loading: false,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update post';
      set({ error: errorMessage, loading: false });
    }
  },

  deletePost: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const { useAxios } = get();
      if (useAxios) {
        await postServiceAxios.deletePost(id);
      } else {
        await postService.deletePost(id);
      }
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete post';
      set({ error: errorMessage, loading: false });
    }
  },
})); 