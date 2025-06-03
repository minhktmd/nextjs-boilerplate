'use client';

import axios from 'axios';
import { Post, Comment } from '../types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const postServiceAxios = {
  async getPosts(): Promise<Post[]> {
    try {
      const response = await api.get<Post[]>('/posts');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch posts: ${error.message}`);
      }
      throw error;
    }
  },

  async getPostById(id: number): Promise<Post> {
    try {
      const response = await api.get<Post>(`/posts/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch post: ${error.message}`);
      }
      throw error;
    }
  },

  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    try {
      const response = await api.get<Comment[]>(`/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch comments: ${error.message}`);
      }
      throw error;
    }
  },

  async createPost(post: Omit<Post, 'id'>): Promise<Post> {
    try {
      const response = await api.post<Post>('/posts', post);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to create post: ${error.message}`);
      }
      throw error;
    }
  },

  async updatePost(id: number, post: Partial<Post>): Promise<Post> {
    try {
      const response = await api.patch<Post>(`/posts/${id}`, post);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to update post: ${error.message}`);
      }
      throw error;
    }
  },

  async deletePost(id: number): Promise<void> {
    try {
      await api.delete(`/posts/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to delete post: ${error.message}`);
      }
      throw error;
    }
  },
}; 