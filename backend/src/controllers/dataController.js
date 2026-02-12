import prisma from "../../prisma/prisma.js"
import jwt from "jsonwebtoken";

//create user

export const dataController = async (req, res) => {
    try {
        const { name, email } = req.body;

        const uniqueUser = await prisma.user.findUnique({
            where: {
                email, name
            }
        })

        if (uniqueUser) {
            const token = jwt.sign({ id: uniqueUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ message: "User already exists", user: uniqueUser, token })
        }

        const user = await prisma.user.create({
            data: {
                name, email
            },
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: "User create successfully", user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//create post
export const createPost = async (req, res) => {
    try {

        //author id connection db poll

        const { title, content, author } = req.body;



        if (!title || !content) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // const authorid = req.user.id;

        const post = await prisma.pOST.create({
            data: {
                title,
                content,
                // author: {
                //     connect: {
                //         id: authorid
                //     }
                // }
                author: {
                    connect: {
                        id: 1
                    }
                },
            }
        })
        res.json({ message: "Post create successfully", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


//get all user

export const getAllUser = async (req, res) => {
    try {
        const user = await prisma.user.findMany({
            include: {
                posts: true
            }
        })
        res.json({ message: "User get successfully", user });
    } catch (error) {
        console.log("Error in get all user", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//get user posts by id 

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                posts: true
            }
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User get successfully", user });

    } catch (error) {
        console.log("Error in get user by id", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


//delete posts

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        //only token bearer holder can delete the post
        const userid = req.user.id;
        console.log("User ID:", req.user.id);


        if (userid !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        const postfind = await prisma.pOST.findUnique({
            where: {
                id: Number(id)
            }
        })

        if (!postfind) {
            return res.status(404).json({ message: "Post not found" });
        }

        const post = await prisma.pOST.delete({
            where: {
                id: Number(id)
            }
        })
        res.json({ message: "Post delete successfully", post });
    } catch (error) {
        console.log("Error in delete post", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//get all posts

export const getAllPosts = async (req, res) => {
    const {search} = req.query;

    try{
        const findPost = await prisma.pOST.findMany({
            where:search ? {
                title:{
                    contains: search,
                    mode: "insensitive"
                }
             }: {},
            include: {
                author: true
            },            orderBy: {
                createdAt: "desc"
            }
        })
        res.json({ message: "Posts get successfully", posts: findPost });
    }catch (error) {
        console.log("Error in get all posts", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//update post

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "All fields are required" })
    }
    try {
        const findPost = await prisma.pOST.update({
            where: {
                id: Number(id)
            },
            data: {
                title, content
            }
        })
        res.json({ message: "Post updated successfully", findPost })
    }
    catch (error) {
        console.log("Error in update post", error);
        res.status(500).json({ message: "Internal server error" });
    }
}