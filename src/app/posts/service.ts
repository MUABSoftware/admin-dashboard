import request from "@src/config/axios";

export const getAllPosts = async (params: any) => {
  try {
    const response = await request.get("/posts", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const getPostById = async (id: any) => {
  try {
    const response = await request.get(`posts/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

export const createPost = async (postData: any) => {
  try {
    const response = await request.post("posts", postData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const updatePost = async (id: any, postData: any) => {
  try {
    const response = await request.put(`posts/${id}`, postData);
    return response.data.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const deletePost = async (id: any) => {
  try {
    const response = await request.delete(`posts/${id}`);
    return response.data.message;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
