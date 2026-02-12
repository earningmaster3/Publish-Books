import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createPost } from "../api/auth.js"; // 👈 properly import the function
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreatePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [postResult, setPostResult] = useState(null);

    const mutation = useMutation({
        mutationFn: createPost,
        onSuccess: (data) => {
            setPostResult(data);
            console.log(data);
            setTitle("");
            setContent("");
            toast.success(data.message);
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        }
    })

    const handleCreatePost = () => {
        mutation.mutate({ title, content });
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center tracking-tight">Create a New Post</h2>

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        placeholder="Enter post title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                        placeholder="Write your content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="4"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 resize-none"
                    />
                </div>

                <button
                    onClick={handleCreatePost}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-lg transform transition duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-indigo-500/30"
                >
                    Create Post
                </button>
                <button onClick={(e) => navigate("/all-posts")} className="w-full bg-indigo-600 
            hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-lg 
            transform transition duration-200 hover:scale-[1.02] 
            active:scale-[0.98] shadow-lg hover:shadow-indigo-500/30">
                    Show all lists
                </button>
            </div>



            <h3>{postResult?.message}</h3>
            <p>{postResult?.post?.title}</p>
            <p>{postResult?.post?.content}</p>


        </div>
    );
};

export default CreatePost;
