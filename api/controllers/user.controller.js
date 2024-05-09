import bcrypt from 'bcrypt'
import User from '../models/user.model.js'
export const test = (req, res) =>  {
    res.json({message : "API is working"});
}

export const updateUser = async (req, res) => {
    try {
        if (req.user.userId !== req.params.userId) {
            return res.status(403).json({ error: "You are not allowed to update this user" });
        }

        const { username, password, email, profilePicture } = req.body;
        let hashedPassword = password; // Initialize hashedPassword with the provided password

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters" });
            }
            hashedPassword = await bcrypt.hash(password, 10); // Hash the provided password
        }

        if (username) {
            if (username.length < 4 || username.length > 20) {
                return res.status(400).json({ error: "Username should be between 4 to 20 characters long" });
            }
            if (username.includes(" ")) {
                return res.status(400).json({ error: "Username cannot contain spaces" });
            }
            if (username !== username.toLowerCase()) {
                return res.status(400).json({ error: "Username must be lowercase" });
            }
            if (!username.match(/^[a-zA-Z0-9]+$/)) {
                return res.status(400).json({ error: 'Username can only contain letters and numbers' });
            }
        }

        // Update the user document in the database
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: username,
                password: hashedPassword, // Use the hashed password
                profilePicture: profilePicture,
                email: email
            }
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Omit the password field from the response
        const { password: userPassword, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        console.log("Error in updateUser controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteUser = async (req,res) => {
    if(req.user.userId !== req.params.userId) {
        return res.status(400).json("You are not allowed to delete this user");
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json({ message: "User deleted successfully" });
        
    } catch (error) {
        console.log('Error in deleteUser controller : ', error.message);
        res.status(500).json({error : "Internal server error"})
    }
}

export const signout = async (req,res) => {
    try {
        res.clearCookie('jwt').status(200).json({message : "User has been signed out successfully"})
    } catch (error) {
        console.log("Error in signout controller", error.message)
        res.status(500).json({error : "Internal server error"});
    }
}