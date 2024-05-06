import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";

export const signup = async (req,res) => {
    try {
        const {username, email, password} = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({error : "All fields are required"});
        }

        const user = await User.findOne({username : username});

        if(user) {
            return res.status(400).json({error : "Username already exist"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = User({
            username, 
            email,
            password : hashedPassword
        })
        if(newUser) {
            await newUser.save();
            res.status(201).json({message : "User created successfully"});
        } else {
            res.status(400).json({error : "Invalid user data"});
        }
        
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({error : "Internal server Error"});
    }
}

export const signin = async (req,res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({error : "All fields are required"});
        }

        const user = await User.findOne({email});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if(!user || !isPasswordCorrect) {
            return res.status(404).json({error : "Invalid Credentials"})
        }
        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id : user._id,
            username : user.username,
            email : user.email,
        })
        
    } catch (error) {
        console.log("Error in signin controller : ", error.message);
        res.status(500).json({error : "Internal Server Error"});
    }
}

export const google = async (req,res) => {
    const {email, name, googlePhotoUrl} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(generatedPassword, salt);
            let newUser = new User({
                username : name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password : hashedPassword,
                profilePicture : googlePhotoUrl
            })
            await newUser.save()
            newUser = await User.findOne({email});
            generateTokenAndSetCookie(newUser._id, res);
            res.status(200).json({
                _id : newUser._id,
                username : newUser.username,
                email : newUser.email,
                photoUrl : newUser.photoUrl
            })
        } else {
            generateTokenAndSetCookie(user._id, res);
            res.status(200).json({
                _id : user._id,
                username : user.username,
                email : user.email,
                photoUrl : user.photoUrl
            })
        }
    } catch (error) {
        console.log("Error in google auth controller : ", error.message);
        res.status(500).json({error : 'Internal Server Error'});
    }
}