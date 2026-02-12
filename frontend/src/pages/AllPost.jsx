import { useQuery } from "@tanstack/react-query";
import { getAllPosts, updatePost } from "../api/auth.js";
import { useState } from "react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {useDebounce} from "use-debounce";


const AllPosts = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 1000);


    const { data, isLoading, isError ,isFetching} = useQuery({
        queryKey: ["allPost",debouncedSearch],
        queryFn: () => getAllPosts(debouncedSearch),
        keepPreviousData: true
    });

    const [editPost, setEditPost] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    

    const mutation = useMutation({
        mutationFn: updatePost,
        onSuccess: () => {
            toast.success("post updated successfully");
            setEditPost(null);
            queryClient.invalidateQueries(["allPost"]);
        }
    })

    const handleUpdate = () => {
        mutation.mutate({ id: editPost, title, content });
    }

    const handleEdit = (post) => {
        setEditPost(post.id);
        setTitle(post.title);
        setContent(post.content);
    }

    if (isLoading) return <h2>Loading posts...</h2>;
    {isFetching && <h2>fetching posts...</h2>}
    
    if (isError) return <h2>Error fetching posts</h2>;

    return (
        <div>
            <h1 className="text-3xl font-bold">All Posts</h1>
            <button onClick={() => navigate("/")} className="bg-blue-500 text-white px-3 py-1 rounded">{'<'} Create Post</button>

            <input placeholder="Search posts..." className="border border-gray-300 rounded px-3 py-1 m-2" value={search} onChange={(e) => setSearch(e.target.value)} />
            {data.posts.map((post) => (
                <div key={post.id} style={{ border: "1px solid gray", margin: 10, padding: 10, borderRadius: 10 }}>
                    {editPost === post.id ? (
                        <>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                            <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
                            <button onClick={handleUpdate} className="bg-blue-500 text-white px-3 py-1 rounded">Update</button>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold">{post.title}</h2>
                            <p className="text-lg">{post.content}</p>
                            <small className="text-gray-500">Author: {post.author?.name}</small>
                            <button onClick={() => handleEdit(post)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                            <button onClick={() => setEditPost(null)} className="bg-red-500 text-white px-3 py-1 rounded">Cancel</button>
                        </>

                    )}

                </div>
            ))}
        </div>
    );
};

export default AllPosts;
