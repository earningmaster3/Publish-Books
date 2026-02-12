import api from "./api.js";

export const createPost = async (userdata) => {
    const response = await api.post("/post", userdata)
    return response.data
}

export const getAllPosts = async () => {
    const response = await api.get("/all-posts")
    return response.data
}

export const updatePost = async (postdata) => {
    const response = await api.put("/post/1", postdata)
    return response.data
}