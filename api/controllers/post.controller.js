import Post from "../models/post.model.js";

export const create = async (req, res) => {
    if(!req.user.isAdmin) {
        return res.status(403).json({error : "You are not allowed to create a post"});
    }

    if(!req.body.title || !req.body.content) {
        return res.status(400).json({error : "All fields are required"});
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    const newPost = new Post({
        ...req.body,
        slug,
        userId : req.user.userId,
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.log("Error in create post controller : ", error.message);
        res.status(500).json({error : "Internal server error"});
    }
}