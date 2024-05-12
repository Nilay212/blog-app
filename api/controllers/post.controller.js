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

export const getposts = async (req, res) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && {userId : req.query.userId}),
            ...(req.query.category && {category : req.query.category}),
            ...(req.query.slug && {slug : req.query.slug}),
            ...(req.query.postId && {_id : req.query.postId}),
            ...(req.query.searchTerm && {
                $or : [
                    {title : {$regex : req.query.searchTerm, $options : 'i'}},
                    {content : {$regex : req.query.searchTerm, $options : 'i'}},
                ]
            })
    }).sort({updatedAt : sortDirection}).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments();
        const now = new Date();

        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth()-1,now.getDate());

        const lastMonthPosts = await Post.countDocuments({
            createdAt : {$gte : oneMonthAgo}
        })
        res.status(200).json({posts, totalPosts, lastMonthPosts})
    } catch (error) {
        console.log("Error in getposts controller : ", error);
        res.status(500).json({error : "Internal server error"});
    }
} 

export const deletePost = async (req, res) => {
    if(!req.user.isAdmin || req.user.userId != req.params.userId) {
        return res.status(403).json({errro : "You are not allowed to delete this post"})
    }

    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json({message : "The post has been deleted successfully"});
    } catch (error) {
        console.log("Error in deletePost controller : ", error.message);
    }
}